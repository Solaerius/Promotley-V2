import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, User, Building, Zap, Save, CreditCard, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAIProfile } from "@/hooks/useAIProfile";
import { useUserCredits } from "@/hooks/useUserCredits";
import { supabase } from "@/integrations/supabase/client";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";
import { AIProfileProgress } from "@/components/AIProfileProgress";
import CreditsDisplay from "@/components/CreditsDisplay";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SWISH_PLANS } from "@/lib/swishConfig";
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
  const navigate = useNavigate();
  const { profile: aiProfile, updateProfile: updateAIProfile, loading: aiProfileLoading } = useAIProfile();
  const { credits, getPlanLabel, refetch: refetchCredits } = useUserCredits();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
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

  const handleCancelSubscription = async () => {
    if (!user?.id) return;
    setIsCancelling(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          plan: 'free_trial',
          max_credits: 1,
          credits_left: 0,
          renewal_date: null
        })
        .eq('id', user.id);
      if (error) throw error;
      toast({ title: "Prenumeration avslutad", description: "Din plan har återställts." });
      refetchCredits();
      setShowCancelDialog(false);
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte avsluta prenumerationen", variant: "destructive" });
    } finally {
      setIsCancelling(false);
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    })
  };

  const hasActivePlan = credits?.plan && !['free_trial'].includes(credits.plan);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Credits & Plan */}
      <motion.section 
        custom={0} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <h2 className="text-xl font-semibold">Plan & Krediter</h2>
        </div>
        <div className="bg-muted/30 rounded-2xl p-6 space-y-4">
          <CreditsDisplay variant="full" />
          
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
            <Button 
              onClick={() => navigate('/pricing')}
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {hasActivePlan ? "Uppgradera plan" : "Köp krediter"}
            </Button>
            
            {hasActivePlan && (
              <Button 
                variant="outline"
                onClick={() => setShowCancelDialog(true)}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <XCircle className="w-4 h-4" />
                Avsluta prenumeration
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Profile Images */}
      <motion.section 
        custom={1} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Profilbilder</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl">
            <User className="h-5 w-5 mb-3 text-muted-foreground" />
            <p className="font-medium mb-4 text-sm">Profilbild</p>
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
          <div className="flex flex-col items-center p-6 bg-muted/30 rounded-2xl">
            <Building className="h-5 w-5 mb-3 text-muted-foreground" />
            <p className="font-medium mb-4 text-sm">Företagslogga</p>
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
      </motion.section>

      {/* Account Info */}
      <motion.section 
        custom={2} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Kontoinformation</h2>
        <div className="space-y-5">
          <div>
            <Label className="text-sm text-muted-foreground">E-post</Label>
            <p className="font-medium mt-1">{user?.email}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Företagsnamn</Label>
            <div className="flex gap-3">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Mitt UF-företag"
                className="bg-muted/30 border-0"
              />
              <Button 
                onClick={handleSaveCompanyName}
                disabled={isSavingCompanyName || companyName === originalCompanyName}
                size="icon"
                variant="secondary"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* AI Profile */}
      <motion.section 
        custom={3} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-4"
      >
        <div>
          <h2 className="text-xl font-semibold mb-1">AI-profil</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Fyll i för bättre AI-svar (minst 3 av 4 första)
          </p>
        </div>
        <AIProfileProgress />
        <div className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Bransch</Label>
              <Input
                value={aiFormData.branch}
                onChange={(e) => setAiFormData(p => ({ ...p, branch: e.target.value }))}
                placeholder="t.ex. E-handel"
                className="bg-muted/30 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Målgrupp</Label>
              <Input
                value={aiFormData.malgrupp}
                onChange={(e) => setAiFormData(p => ({ ...p, malgrupp: e.target.value }))}
                placeholder="t.ex. 18-25 år"
                className="bg-muted/30 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Prisnivå</Label>
              <Input
                value={aiFormData.prisniva}
                onChange={(e) => setAiFormData(p => ({ ...p, prisniva: e.target.value }))}
                placeholder="t.ex. Budget"
                className="bg-muted/30 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Målsättning</Label>
              <Input
                value={aiFormData.malsattning}
                onChange={(e) => setAiFormData(p => ({ ...p, malsattning: e.target.value }))}
                placeholder="t.ex. Öka synlighet"
                className="bg-muted/30 border-0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Produktbeskrivning</Label>
            <Textarea
              value={aiFormData.produkt_beskrivning}
              onChange={(e) => setAiFormData(p => ({ ...p, produkt_beskrivning: e.target.value }))}
              placeholder="Beskriv din produkt/tjänst..."
              rows={3}
              className="bg-muted/30 border-0 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Marknadsplan</Label>
            <Textarea
              value={aiFormData.marknadsplan}
              onChange={(e) => setAiFormData(p => ({ ...p, marknadsplan: e.target.value }))}
              placeholder="Nuvarande marknadsföringsstrategi..."
              rows={3}
              className="bg-muted/30 border-0 resize-none"
            />
          </div>
          <Button 
            onClick={handleSaveAIProfile} 
            disabled={isSavingAIProfile}
            className="w-full sm:w-auto"
          >
            {isSavingAIProfile ? "Sparar..." : "Spara AI-profil"}
          </Button>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section 
        custom={4} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="pt-8 border-t border-destructive/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-destructive">Radera konto</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Permanent radering av alla data
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Radera
          </Button>
        </div>
      </motion.section>

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

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Avsluta prenumeration?</AlertDialogTitle>
            <AlertDialogDescription>
              Din nuvarande plan ({credits ? getPlanLabel(credits.plan) : ''}) avslutas och du förlorar tillgång till dina krediter. Du kan alltid köpa en ny plan senare.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Behåll plan</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancelSubscription} 
              disabled={isCancelling}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isCancelling ? "Avslutar..." : "Avsluta prenumeration"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountContent;
