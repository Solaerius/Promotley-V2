import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, User, Building, Zap, Save, CreditCard, XCircle, ArrowDown, Plus, Home, LogOut } from "lucide-react";
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
import { SWISH_PLANS, CREDIT_PACKAGES } from "@/lib/swishConfig";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    foretagsnamn: "",
    branch: "",
    stad: "",
    postnummer: "",
    lan: "",
    land: "",
    malgrupp: "",
    produkt_beskrivning: "",
    prisniva: "",
    marknadsplan: "",
    malsattning: "",
    tonalitet: "",
    allman_info: "",
    nyckelord: "",
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
        foretagsnamn: aiProfile.foretagsnamn || "",
        branch: aiProfile.branch || "",
        stad: aiProfile.stad || "",
        postnummer: aiProfile.postnummer || "",
        lan: aiProfile.lan || "",
        land: aiProfile.land || "",
        malgrupp: aiProfile.malgrupp || "",
        produkt_beskrivning: aiProfile.produkt_beskrivning || "",
        prisniva: aiProfile.prisniva || "",
        marknadsplan: aiProfile.marknadsplan || "",
        malsattning: aiProfile.malsattning || "",
        tonalitet: aiProfile.tonalitet || "",
        allman_info: aiProfile.allman_info || "",
        nyckelord: aiProfile.nyckelord?.join(", ") || "",
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
      const { nyckelord, foretagsnamn, ...rest } = aiFormData;
      await updateAIProfile({
        ...rest,
        // Sync company name from account info
        foretagsnamn: companyName.trim() || foretagsnamn,
        nyckelord: nyckelord ? nyckelord.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
      });
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

  const handleDowngrade = async () => {
    if (!user?.id || !selectedDowngradePlan) return;
    setIsDowngrading(true);
    try {
      const plan = SWISH_PLANS[selectedDowngradePlan as keyof typeof SWISH_PLANS];
      const { error } = await supabase
        .from('users')
        .update({ 
          plan: selectedDowngradePlan as any,
          max_credits: plan.credits,
          credits_left: Math.min(credits?.credits_left || 0, plan.credits),
        })
        .eq('id', user.id);
      if (error) throw error;
      toast({ title: "Plan nedgraderad", description: `Du har nu ${plan.name}.` });
      refetchCredits();
      setShowDowngradeDialog(false);
      setSelectedDowngradePlan(null);
    } catch (error) {
      toast({ title: "Fel", description: "Kunde inte nedgradera planen", variant: "destructive" });
    } finally {
      setIsDowngrading(false);
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
  const currentTierLevel = credits?.plan ? getTierLevel(credits.plan) : 0;

  const downgradeOptions = Object.entries(SWISH_PLANS).filter(([key]) => {
    const planLevel = getTierLevel(key);
    return planLevel < currentTierLevel;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Credits & Plan */}
      <motion.section 
        custom={0} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-2"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-warning" />
          </div>
          <h2 className="text-lg font-semibold">Plan & Krediter</h2>
        </div>
        <div className="bg-muted/30 rounded-2xl p-3 space-y-3">
          <CreditsDisplay variant="full" />
          
          {/* Credit top-up packages */}
          <div className="pt-2 border-t border-border/50">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Fyll på krediter
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="flex flex-col h-auto py-2 hover:bg-primary/5 hover:border-primary/50"
                  onClick={() => navigate(`/swish-checkout?type=credits&package=${key}`)}
                >
                  <span className="text-base font-bold">{pkg.credits}</span>
                  <span className="text-xs text-muted-foreground">krediter</span>
                  <span className="text-sm font-semibold text-primary mt-0.5">{pkg.price} kr</span>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Plan actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            <Button 
              onClick={() => navigate('/pricing')}
              className="gap-2"
              size="sm"
            >
              <CreditCard className="w-4 h-4" />
              {hasActivePlan ? "Uppgradera plan" : "Välj plan"}
            </Button>
            
            {hasActivePlan && downgradeOptions.length > 0 && (
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowDowngradeDialog(true)}
                className="gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                Nedgradera plan
              </Button>
            )}
            
            {hasActivePlan && (
              <Button 
                variant="outline"
                size="sm"
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
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold mb-2">Profilbilder</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-2xl">
            <User className="h-4 w-4 mb-2 text-muted-foreground" />
            <p className="font-medium mb-2 text-sm">Profilbild</p>
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
          <div className="flex flex-col items-center p-3 bg-muted/30 rounded-2xl">
            <Building className="h-4 w-4 mb-2 text-muted-foreground" />
            <p className="font-medium mb-2 text-sm">Företagslogga</p>
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
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold mb-2">Kontoinformation</h2>
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-muted-foreground">E-post</Label>
            <p className="font-medium mt-1">{user?.email}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Företagsnamn</Label>
            <div className="flex gap-2">
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Mitt UF-företag"
                className="bg-muted/30 border border-border"
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
        className="space-y-2"
      >
        <div>
          <h2 className="text-lg font-semibold mb-1">AI-profil</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Fyll i alla obligatoriska fält för bästa AI-svar
          </p>
        </div>
        <AIProfileProgress />
        <div className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-sm">Bransch <span className="text-destructive">*</span></Label>
              <Input
                value={aiFormData.branch}
                onChange={(e) => setAiFormData(p => ({ ...p, branch: e.target.value }))}
                placeholder="t.ex. E-handel"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Stad <span className="text-destructive">*</span></Label>
              <Input
                value={aiFormData.stad}
                onChange={(e) => setAiFormData(p => ({ ...p, stad: e.target.value }))}
                placeholder="t.ex. Stockholm"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Postnummer <span className="text-destructive">*</span></Label>
              <Input
                value={aiFormData.postnummer}
                onChange={(e) => setAiFormData(p => ({ ...p, postnummer: e.target.value }))}
                placeholder="t.ex. 114 52"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Land</Label>
              <Input
                value={aiFormData.land}
                onChange={(e) => setAiFormData(p => ({ ...p, land: e.target.value }))}
                placeholder="Sverige"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Målgrupp <span className="text-destructive">*</span></Label>
              <Input
                value={aiFormData.malgrupp}
                onChange={(e) => setAiFormData(p => ({ ...p, malgrupp: e.target.value }))}
                placeholder="t.ex. 18-25 år"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Målsättning</Label>
              <Input
                value={aiFormData.malsattning}
                onChange={(e) => setAiFormData(p => ({ ...p, malsattning: e.target.value }))}
                placeholder="t.ex. Öka synlighet"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Prisnivå</Label>
              <Input
                value={aiFormData.prisniva}
                onChange={(e) => setAiFormData(p => ({ ...p, prisniva: e.target.value }))}
                placeholder="t.ex. Budget"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm">Vilken ton ska Promotely AI ha?</Label>
              <Input
                value={aiFormData.tonalitet}
                onChange={(e) => setAiFormData(p => ({ ...p, tonalitet: e.target.value }))}
                placeholder="t.ex. Lekfull, professionell"
                className="bg-muted/30 border border-border"
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-sm">Era grundprinciper</Label>
              <Input
                value={aiFormData.nyckelord}
                onChange={(e) => setAiFormData(p => ({ ...p, nyckelord: e.target.value }))}
                placeholder="hållbarhet, handgjort (separera med komma)"
                className="bg-muted/30 border border-border"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Företagsbeskrivning <span className="text-destructive">*</span></Label>
            <Textarea
              value={aiFormData.produkt_beskrivning}
              onChange={(e) => setAiFormData(p => ({ ...p, produkt_beskrivning: e.target.value }))}
              placeholder="Beskriv din produkt/tjänst..."
              rows={3}
              className="bg-muted/30 border border-border resize-none"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Marknadsplan</Label>
            <Textarea
              value={aiFormData.marknadsplan}
              onChange={(e) => setAiFormData(p => ({ ...p, marknadsplan: e.target.value }))}
              placeholder="Nuvarande marknadsföringsstrategi..."
              rows={3}
              className="bg-muted/30 border border-border resize-none"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-sm">Allmän information</Label>
            <Textarea
              value={aiFormData.allman_info}
              onChange={(e) => setAiFormData(p => ({ ...p, allman_info: e.target.value }))}
              placeholder="Berätta mer om ert företag – era värderingar, framtidsplaner, unika styrkor..."
              rows={3}
              className="bg-muted/30 border border-border resize-none"
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

      {/* Navigation */}
      <motion.section 
        custom={4} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="space-y-2"
      >
        <h2 className="text-lg font-semibold mb-2">Navigering</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/')}>
            <Home className="w-4 h-4" />
            Till startsidan
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" onClick={async () => { await signOut(); navigate('/auth'); }}>
            <LogOut className="w-4 h-4" />
            Logga ut
          </Button>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section 
        custom={5} 
        variants={sectionVariants} 
        initial="hidden" 
        animate="visible"
        className="pt-4 border-t border-destructive/20"
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

      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nedgradera plan</AlertDialogTitle>
            <AlertDialogDescription>
              Välj vilken plan du vill nedgradera till. Dina befintliga krediter behålls upp till den nya planens gräns.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={selectedDowngradePlan || ""} onValueChange={setSelectedDowngradePlan}>
              <SelectTrigger>
                <SelectValue placeholder="Välj plan" />
              </SelectTrigger>
              <SelectContent>
                {downgradeOptions.map(([key, plan]) => (
                  <SelectItem key={key} value={key}>
                    {plan.name} – {plan.credits} krediter/månad ({plan.price} kr)
                  </SelectItem>
                ))
                }
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDowngradePlan(null)}>Avbryt</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDowngrade} 
              disabled={isDowngrading || !selectedDowngradePlan}
            >
              {isDowngrading ? "Nedgraderar..." : "Bekräfta nedgradering"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountContent;
