import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, Trash2, User, Building, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useConnections } from "@/hooks/useConnections";
import { useAIProfile } from "@/hooks/useAIProfile";
import { useUserCredits } from "@/hooks/useUserCredits";
import { supabase } from "@/integrations/supabase/client";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";
import { AIProfileProgress } from "@/components/AIProfileProgress";
import CreditsDisplay from "@/components/CreditsDisplay";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AccountContent = () => {
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const { profile: aiProfile, updateProfile: updateAIProfile, loading: aiProfileLoading } = useAIProfile();
  const { credits, getPlanLabel, refetch: refetchCredits } = useUserCredits();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [originalCompanyName, setOriginalCompanyName] = useState("");
  const [isSavingCompanyName, setIsSavingCompanyName] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);

  const [aiFormData, setAiFormData] = useState({
    branch: "",
    malgrupp: "",
    produkt_beskrivning: "",
    prisniva: "",
    marknadsplan: "",
    malsattning: "",
  });
  const [isSavingAIProfile, setIsSavingAIProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('company_name, avatar_url, company_logo_url')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setCompanyName(data.company_name || "");
        setOriginalCompanyName(data.company_name || "");
        setAvatarUrl(data.avatar_url);
        setCompanyLogoUrl(data.company_logo_url);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (aiProfile) {
      setAiFormData({
        branch: aiProfile.branch || "",
        malgrupp: aiProfile.malgrupp || "",
        produkt_beskrivning: aiProfile.produkt_beskrivning || "",
        prisniva: aiProfile.prisniva || "",
        marknadsplan: aiProfile.marknadsplan || "",
        malsattning: aiProfile.malsattning || "",
      });
    }
  }, [aiProfile]);

  const handleSaveCompanyName = async () => {
    if (!user?.id || !companyName.trim()) return;
    setIsSavingCompanyName(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ company_name: companyName.trim() })
        .eq('id', user.id);
      if (error) throw error;
      setOriginalCompanyName(companyName);
      toast({ title: "Namn uppdaterat" });
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte uppdatera", variant: "destructive" });
    } finally {
      setIsSavingCompanyName(false);
    }
  };

  const handleSaveAIProfile = async () => {
    setIsSavingAIProfile(true);
    try {
      await updateAIProfile(aiFormData);
      toast({ title: "AI-profil sparad" });
    } catch (error) {
      toast({ title: "Fel", variant: "destructive" });
    } finally {
      setIsSavingAIProfile(false);
    }
  };

  const confirmDeleteAccount = async () => {
    if (!user?.id) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.rpc('soft_delete_user_account', { _user_id: user.id });
      if (error) throw error;
      toast({ title: "Konto raderat", description: "Du har 30 dagar att ångra dig." });
      await signOut();
    } catch (error) {
      toast({ title: "Fel", variant: "destructive" });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Credits & Plan */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Plan & Krediter
        </h2>
        <CreditsDisplay variant="full" />
      </Card>

      {/* Profile Images */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Profilbilder</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <User className="h-5 w-5 mb-2 text-muted-foreground" />
            <p className="font-medium mb-3 text-sm">Profilbild</p>
            {user?.id && (
              <ProfileImageUpload
                userId={user.id}
                currentUrl={avatarUrl}
                type="avatar"
                onUploadComplete={(url) => setAvatarUrl(url || null)}
                size="lg"
              />
            )}
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Building className="h-5 w-5 mb-2 text-muted-foreground" />
            <p className="font-medium mb-3 text-sm">Företagslogga</p>
            {user?.id && (
              <ProfileImageUpload
                userId={user.id}
                currentUrl={companyLogoUrl}
                type="company_logo"
                onUploadComplete={(url) => setCompanyLogoUrl(url || null)}
                size="lg"
              />
            )}
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Kontoinformation</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">E-post</Label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Företagsnamn</Label>
            <div className="flex gap-2">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Mitt UF-företag"
              />
              <Button 
                onClick={handleSaveCompanyName}
                disabled={isSavingCompanyName || companyName === originalCompanyName}
              >
                {isSavingCompanyName ? "Sparar..." : "Spara"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Profile */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-2">AI-profil</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Fyll i för att få bättre AI-svar (minst 3 av 4 första fälten)
        </p>
        <AIProfileProgress />
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Bransch</Label>
              <Input
                value={aiFormData.branch}
                onChange={(e) => setAiFormData(p => ({ ...p, branch: e.target.value }))}
                placeholder="t.ex. E-handel, Hälsa"
              />
            </div>
            <div>
              <Label>Målgrupp</Label>
              <Input
                value={aiFormData.malgrupp}
                onChange={(e) => setAiFormData(p => ({ ...p, malgrupp: e.target.value }))}
                placeholder="t.ex. Unga vuxna 18-25"
              />
            </div>
            <div>
              <Label>Prisnivå</Label>
              <Input
                value={aiFormData.prisniva}
                onChange={(e) => setAiFormData(p => ({ ...p, prisniva: e.target.value }))}
                placeholder="t.ex. Budget, Premium"
              />
            </div>
            <div>
              <Label>Målsättning</Label>
              <Input
                value={aiFormData.malsattning}
                onChange={(e) => setAiFormData(p => ({ ...p, malsattning: e.target.value }))}
                placeholder="t.ex. Öka varumärkeskännedom"
              />
            </div>
          </div>
          <div>
            <Label>Produktbeskrivning</Label>
            <Textarea
              value={aiFormData.produkt_beskrivning}
              onChange={(e) => setAiFormData(p => ({ ...p, produkt_beskrivning: e.target.value }))}
              placeholder="Beskriv din produkt/tjänst..."
              rows={3}
            />
          </div>
          <div>
            <Label>Marknadsplan</Label>
            <Textarea
              value={aiFormData.marknadsplan}
              onChange={(e) => setAiFormData(p => ({ ...p, marknadsplan: e.target.value }))}
              placeholder="Nuvarande marknadsföringsstrategi..."
              rows={3}
            />
          </div>
          <Button onClick={handleSaveAIProfile} disabled={isSavingAIProfile}>
            {isSavingAIProfile ? "Sparar..." : "Spara AI-profil"}
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/50">
        <h2 className="text-xl font-bold mb-4 text-destructive">Riskzon</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Radera konto</p>
            <p className="text-sm text-muted-foreground">
              Permanent radering av ditt konto och all data
            </p>
          </div>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Radera
          </Button>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Radera konto?</AlertDialogTitle>
            <AlertDialogDescription>
              Ditt konto raderas om 30 dagar. Du kan ångra dig genom att logga in igen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Raderar..." : "Radera"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountContent;
