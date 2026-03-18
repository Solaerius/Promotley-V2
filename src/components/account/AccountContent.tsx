import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, User, Building, Zap, Save, CreditCard, XCircle, ArrowDown, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAIProfile } from "@/hooks/useAIProfile";
import { useUserCredits } from "@/hooks/useUserCredits";
import { supabase } from "@/integrations/supabase/client";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";
import { AIProfileProgress } from "@/components/AIProfileProgress";
import CreditsDisplay from "@/components/CreditsDisplay";
import PromoCodeInput from "@/components/PromoCodeInput";
import { useNavigate } from "react-router-dom";
import { STRIPE_CREDIT_PACKAGES, STRIPE_PLANS } from "@/lib/stripeConfig";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const AccountContent = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { profile: aiProfile, updateProfile: updateAIProfile, loading: aiProfileLoading } = useAIProfile();
  const { credits, getPlanLabel, getTierLevel, refetch: refetchCredits } = useUserCredits();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [selectedDowngradePlan, setSelectedDowngradePlan] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDowngrading, setIsDowngrading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [originalCompanyName, setOriginalCompanyName] = useState("");
  const [isSavingCompanyName, setIsSavingCompanyName] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  const [aiFormData, setAiFormData] = useState({
    foretagsnamn: "", branch: "", stad: "", postnummer: "", lan: "", land: "",
    malgrupp: "", produkt_beskrivning: "", prisniva: "", marknadsplan: "",
    malsattning: "", tonalitet: "", allman_info: "", nyckelord: "",
  });
  const [isSavingAIProfile, setIsSavingAIProfile] = useState(false);
  const [hasActiveStripeSubscription, setHasActiveStripeSubscription] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const handleOpenPortal = async () => {
    setIsOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-portal', { body: {} });
      if (error || !data?.url) {
        toast({ title: "Ingen aktiv prenumeration hittades", variant: "destructive" });
        return;
      }
      window.location.href = data.url;
    } catch {
      toast({ title: "Fel", description: "Kunde inte öppna prenumerationshanteringen.", variant: "destructive" });
    } finally {
      setIsOpeningPortal(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase.from('users').select('company_name, avatar_url, company_logo_url').eq('id', user.id).single();
      if (!error && data) {
        setCompanyName(data.company_name || "");
        setOriginalCompanyName(data.company_name || "");
        setAvatarUrl(data.avatar_url);
        setCompanyLogoUrl(data.company_logo_url);
      }
    };
    fetchUserData();

    // Check for active Stripe subscription
    const checkStripeSubscription = async () => {
      if (!user?.id) return;
      const { data } = await supabase
        .from('stripe_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
      setHasActiveStripeSubscription(!!data);
    };
    checkStripeSubscription();
  }, [user]);

  useEffect(() => {
    if (aiProfile) {
      setAiFormData({
        foretagsnamn: aiProfile.foretagsnamn || "", branch: aiProfile.branch || "",
        stad: aiProfile.stad || "", postnummer: aiProfile.postnummer || "",
        lan: aiProfile.lan || "", land: aiProfile.land || "",
        malgrupp: aiProfile.malgrupp || "", produkt_beskrivning: aiProfile.produkt_beskrivning || "",
        prisniva: aiProfile.prisniva || "", marknadsplan: aiProfile.marknadsplan || "",
        malsattning: aiProfile.malsattning || "", tonalitet: aiProfile.tonalitet || "",
        allman_info: aiProfile.allman_info || "", nyckelord: aiProfile.nyckelord?.join(", ") || "",
      });
    }
  }, [aiProfile]);

  const handleSaveCompanyName = async () => {
    if (!user?.id || !companyName.trim()) return;
    setIsSavingCompanyName(true);
    try {
      const { error } = await supabase.from('users').update({ company_name: companyName.trim() }).eq('id', user.id);
      if (error) throw error;
      setOriginalCompanyName(companyName);
      toast({ title: "Namn uppdaterat" });
    } catch { toast({ title: "Fel", variant: "destructive" }); }
    finally { setIsSavingCompanyName(false); }
  };

  const handleSaveAIProfile = async () => {
    setIsSavingAIProfile(true);
    try {
      const { nyckelord, foretagsnamn, ...rest } = aiFormData;
      await updateAIProfile({
        ...rest,
        foretagsnamn: companyName.trim() || foretagsnamn,
        nyckelord: nyckelord ? nyckelord.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
      });
      toast({ title: "AI-profil sparad" });
    } catch { toast({ title: "Fel", variant: "destructive" }); }
    finally { setIsSavingAIProfile(false); }
  };

  const handleCancelSubscription = async () => {
    if (!user?.id) return;
    setIsCancelling(true);
    try {
      const { error } = await supabase.from('users').update({ plan: 'free_trial', max_credits: 1, credits_left: 0, renewal_date: null }).eq('id', user.id);
      if (error) throw error;
      toast({ title: "Prenumeration avslutad" });
      refetchCredits();
      setShowCancelDialog(false);
    } catch { toast({ title: "Fel", variant: "destructive" }); }
    finally { setIsCancelling(false); }
  };

  const handleDowngrade = async () => {
    if (!user?.id || !selectedDowngradePlan) return;
    setIsDowngrading(true);
    try {
      const plan = STRIPE_PLANS[selectedDowngradePlan as keyof typeof STRIPE_PLANS];
      const { error } = await supabase.from('users').update({
        plan: selectedDowngradePlan as any,
        max_credits: plan.credits,
        credits_left: Math.min(credits?.credits_left || 0, plan.credits),
      }).eq('id', user.id);
      if (error) throw error;
      toast({ title: "Plan nedgraderad" });
      refetchCredits();
      setShowDowngradeDialog(false);
      setSelectedDowngradePlan(null);
    } catch { toast({ title: "Fel", variant: "destructive" }); }
    finally { setIsDowngrading(false); }
  };

  const confirmDeleteAccount = async () => {
    if (!user?.id) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('soft_delete_user_account', { _user_id: user.id });
      if (error) throw error;
      toast({ title: "Konto raderat", description: "Du har 30 dagar att angra dig." });
      await signOut();
    } catch {
      toast({ title: "Fel", variant: "destructive" });
      setIsDeleting(false);
    }
  };

  const hasActivePlan = credits?.plan && !['free_trial'].includes(credits.plan);
  const currentTierLevel = credits?.plan ? getTierLevel(credits.plan) : 0;
  const downgradeOptions = Object.entries(STRIPE_PLANS).filter(([key]) => getTierLevel(key) < currentTierLevel);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Plan & Credits */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <h2 className="text-base font-medium text-foreground">Plan & Krediter</h2>
        </div>
        <div className="rounded-xl bg-card shadow-sm p-4 space-y-3">
          <CreditsDisplay variant="full" />

          <div className="pt-3 border-t border-border">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" /> Fyll pa krediter
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(STRIPE_CREDIT_PACKAGES).map(([key, pkg]) => (
                <Button key={key} variant="outline" className="flex flex-col h-auto py-2" onClick={() => navigate(`/checkout?package=${key}&type=credits`)}>
                  <span className="text-base font-bold">{pkg.credits}</span>
                  <span className="text-[10px] text-muted-foreground">krediter</span>
                  <span className="text-sm font-semibold text-primary mt-0.5">{pkg.price} kr</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
            <Button onClick={() => navigate('/pricing')} size="sm">
              <CreditCard className="w-4 h-4 mr-1.5" />
              {hasActivePlan ? "Uppgradera plan" : "Välj plan"}
            </Button>
            {hasActiveStripeSubscription && (
              <Button variant="outline" size="sm" onClick={handleOpenPortal} disabled={isOpeningPortal}>
                <CreditCard className="w-4 h-4 mr-1.5" />
                {isOpeningPortal ? "Öppnar..." : "Hantera prenumeration"}
              </Button>
            )}
            {hasActivePlan && downgradeOptions.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowDowngradeDialog(true)}>
                <ArrowDown className="w-4 h-4 mr-1.5" /> Nedgradera
              </Button>
            )}
            {hasActivePlan && (
              <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)} className="text-destructive hover:text-destructive">
                <XCircle className="w-4 h-4 mr-1.5" /> Avsluta
              </Button>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <PromoCodeInput variant="inline" onSuccess={() => refetchCredits()} />
          </div>
        </div>
      </section>

      {/* Profile Images */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-foreground">Profilbilder</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center p-4 rounded-xl bg-card shadow-sm">
            <User className="h-4 w-4 mb-2 text-muted-foreground" />
            <p className="font-medium mb-2 text-sm">Profilbild</p>
            {user?.id && <ProfileImageUpload userId={user.id} currentUrl={avatarUrl} type="avatar" onUploadComplete={(url) => setAvatarUrl(url || null)} size="lg" />}
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-card shadow-sm">
            <Building className="h-4 w-4 mb-2 text-muted-foreground" />
            <p className="font-medium mb-2 text-sm">Företagslogga</p>
            {user?.id && <ProfileImageUpload userId={user.id} currentUrl={companyLogoUrl} type="company_logo" onUploadComplete={(url) => setCompanyLogoUrl(url || null)} size="lg" />}
          </div>
        </div>
      </section>

      {/* Account Info */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-foreground">Kontoinformation</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-muted-foreground">E-post</Label>
            <p className="font-medium mt-1 text-sm">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Företagsnamn</Label>
            <div className="flex gap-2">
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Mitt UF-företag" className="bg-background border-border" />
              <Button onClick={handleSaveCompanyName} disabled={isSavingCompanyName || companyName === originalCompanyName} size="icon" variant="secondary">
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Profile */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-medium text-foreground mb-0.5">AI-profil</h2>
          <p className="text-sm text-muted-foreground">Fyll i alla obligatoriska fält för bästa AI-svar</p>
        </div>
        <AIProfileProgress />
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "branch", label: "Bransch", placeholder: "t.ex. E-handel", required: true },
              { key: "stad", label: "Stad", placeholder: "t.ex. Stockholm", required: true },
              { key: "postnummer", label: "Postnummer", placeholder: "t.ex. 114 52", required: true },
              { key: "land", label: "Land", placeholder: "Sverige" },
              { key: "malgrupp", label: "Målgrupp", placeholder: "t.ex. 18-25 år", required: true },
              { key: "malsattning", label: "Målsättning", placeholder: "t.ex. Öka synlighet" },
              { key: "prisniva", label: "Prisniva", placeholder: "t.ex. Budget" },
              { key: "tonalitet", label: "Ton", placeholder: "t.ex. Lekfull, professionell" },
            ].map(({ key, label, placeholder, required }) => (
              <div key={key} className="space-y-1">
                <Label className="text-sm">{label} {required && <span className="text-destructive">*</span>}</Label>
                <Input
                  value={(aiFormData as any)[key]}
                  onChange={(e) => setAiFormData(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="bg-background border-border"
                />
              </div>
            ))}
            <div className="space-y-1 col-span-2">
              <Label className="text-sm">Era grundprinciper</Label>
              <Input value={aiFormData.nyckelord} onChange={(e) => setAiFormData(p => ({ ...p, nyckelord: e.target.value }))} placeholder="hållbarhet, handgjort (separera med komma)" className="bg-background border-border" />
            </div>
          </div>
          {[
            { key: "produkt_beskrivning", label: "Företagsbeskrivning", placeholder: "Beskriv din produkt/tjänst...", required: true },
            { key: "marknadsplan", label: "Marknadsplan", placeholder: "Nuvarande marknadsföringsstrategi..." },
            { key: "allman_info", label: "Allmän information", placeholder: "Berätta mer om ert företag..." },
          ].map(({ key, label, placeholder, required }) => (
            <div key={key} className="space-y-1">
              <Label className="text-sm">{label} {required && <span className="text-destructive">*</span>}</Label>
              <Textarea
                value={(aiFormData as any)[key]}
                onChange={(e) => setAiFormData(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                rows={3}
                className="bg-background border-border resize-none"
              />
            </div>
          ))}
          <Button onClick={handleSaveAIProfile} disabled={isSavingAIProfile} className="w-full sm:w-auto">
            {isSavingAIProfile ? "Sparar..." : "Spara AI-profil"}
          </Button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pt-4 border-t border-destructive/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-destructive text-sm">Radera konto</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Permanent radering av alla data</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Radera
          </Button>
        </div>
      </section>

      {/* Dialogs */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera konto?</AlertDialogTitle>
            <AlertDialogDescription>Ditt konto raderas om 30 dagar. Du kan angra dig genom att logga in igen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAccount} disabled={isDeleting}>{isDeleting ? "Raderar..." : "Radera"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Avsluta prenumeration?</AlertDialogTitle>
            <AlertDialogDescription>Din plan ({credits ? getPlanLabel(credits.plan) : ''}) avslutas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Behall plan</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} disabled={isCancelling} className="bg-destructive hover:bg-destructive/90">
              {isCancelling ? "Avslutar..." : "Avsluta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nedgradera plan</AlertDialogTitle>
            <AlertDialogDescription>Välj vilken plan du vill nedgradera till.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={selectedDowngradePlan || ""} onValueChange={setSelectedDowngradePlan}>
              <SelectTrigger><SelectValue placeholder="Välj plan" /></SelectTrigger>
              <SelectContent>
                {downgradeOptions.map(([key, plan]) => (
                  <SelectItem key={key} value={key}>{plan.name} - {plan.credits} krediter ({plan.price} kr)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDowngradePlan(null)}>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleDowngrade} disabled={isDowngrading || !selectedDowngradePlan}>
              {isDowngrading ? "Nedgraderar..." : "Bekrafta"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountContent;
