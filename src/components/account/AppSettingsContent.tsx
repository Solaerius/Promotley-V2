import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Instagram, Music2, Link as LinkIcon, XCircle, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useConnections } from "@/hooks/useConnections";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const AppSettingsContent = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { connections, loadConnections, isConnected, getConnection } = useConnections();
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  const connectInstagram = async () => {
    setConnectingProvider('instagram');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast({ title: "Inte inloggad", variant: "destructive" }); setConnectingProvider(null); return; }
      const { data, error } = await supabase.functions.invoke('init-meta-oauth', { headers: { Authorization: `Bearer ${session.access_token}` }, body: { provider: 'meta_ig' } });
      if (error || !data?.url) throw error;
      window.location.href = data.url;
    } catch { toast({ title: "Anslutning misslyckades", variant: "destructive" }); setConnectingProvider(null); }
  };

  const connectTikTok = async () => {
    setConnectingProvider('tiktok');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast({ title: "Inte inloggad", variant: "destructive" }); return; }
      const { data, error } = await supabase.functions.invoke('init-tiktok-oauth', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error || !data?.url) throw error;
      window.location.href = data.url;
    } catch { toast({ title: "Anslutning misslyckades", variant: "destructive" }); setConnectingProvider(null); }
  };

  const disconnectProvider = async (provider: 'tiktok' | 'meta_ig') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const connection = getConnection(provider);
      if (!connection) return;
      if (provider === 'meta_ig') {
        const { error } = await supabase.functions.invoke('disconnect-meta', { headers: { Authorization: `Bearer ${session.access_token}` }, body: { provider } });
        if (error) throw error;
      } else {
        await supabase.from('tokens').delete().eq('user_id', session.user.id).eq('provider', provider);
        await supabase.from('connections').delete().eq('id', connection.id);
      }
      await loadConnections();
      toast({ title: "Frankopplad" });
    } catch { toast({ title: "Fel", variant: "destructive" }); }
  };

  const platformConnections = [
    { name: "Instagram", provider: 'meta_ig' as const, icon: Instagram, connect: connectInstagram, note: "Kraver foretagskonto kopplat till Facebook-sida", comingSoon: true },
    { name: "TikTok", provider: 'tiktok' as const, icon: Music2, connect: connectTikTok },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Theme */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-foreground">Utseende</h2>
        <p className="text-sm text-muted-foreground">Valj mellan ljust, morkt eller systemets tema</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Ljust", icon: Sun },
            { value: "dark", label: "Morkt", icon: Moon },
            { value: "system", label: "System", icon: Monitor },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`p-4 rounded-xl transition-all ${
                theme === value ? "bg-primary/5 shadow-sm ring-1 ring-primary/20" : "bg-card shadow-sm hover:shadow-md"
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">{label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Social Connections */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-foreground">Kopplade konton</h2>
        <p className="text-sm text-muted-foreground">Anslut dina sociala medier for att se statistik</p>
        <div className="space-y-2">
          {platformConnections.map((platform) => {
            const connected = isConnected(platform.provider);
            const connection = getConnection(platform.provider);
            const Icon = platform.icon;
            const isLoading = connectingProvider === platform.provider.replace('meta_', '');

            return (
              <div key={platform.provider} className="flex items-center justify-between p-4 rounded-xl bg-card shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{platform.name}</p>
                      {platform.comingSoon && !connected && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Snart</span>
                      )}
                    </div>
                    {connected && connection?.username && <p className="text-xs text-muted-foreground">@{connection.username}</p>}
                    {!connected && platform.note && <p className="text-xs text-muted-foreground">{platform.note}</p>}
                  </div>
                </div>
                {connected ? (
                  <Button variant="outline" size="sm" onClick={() => disconnectProvider(platform.provider)}>
                    <XCircle className="w-4 h-4 mr-1" /> Koppla fran
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={platform.connect} disabled={isLoading || platform.comingSoon}>
                    {isLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <LinkIcon className="w-4 h-4 mr-1" />}
                    Anslut
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AppSettingsContent;
