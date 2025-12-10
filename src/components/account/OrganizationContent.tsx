import { useState, useEffect } from "react";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Settings, Users, Link as LinkIcon, Copy, Mail, Loader2, Shield, ShieldCheck, Crown, AlertTriangle, UserMinus } from "lucide-react";
import { ProfileImageUpload } from "@/components/ProfileImageUpload";

const OrganizationContent = () => {
  const { 
    activeOrganization, 
    membership, 
    members, 
    invites,
    updateOrganization,
    createEmailInvite,
    updateMemberPermissions,
    updateMemberRole,
    removeMember,
  } = useOrganization();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState("");
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    if (activeOrganization) {
      setOrgName(activeOrganization.name);
      setInviteLinkEnabled(activeOrganization.invite_link_enabled);
    }
  }, [activeOrganization]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await updateOrganization({ name: orgName, invite_link_enabled: inviteLinkEnabled });
    setIsSaving(false);
  };

  const handleCopyInviteCode = () => {
    if (activeOrganization?.invite_code) {
      navigator.clipboard.writeText(activeOrganization.invite_code);
      toast.success("Inbjudningskod kopierad!");
    }
  };

  const handleCopyInviteLink = () => {
    if (activeOrganization?.invite_code) {
      const link = `${window.location.origin}/join/${activeOrganization.invite_code}`;
      navigator.clipboard.writeText(link);
      toast.success("Inbjudningslänk kopierad!");
    }
  };

  const handleSendEmailInvite = async () => {
    if (!inviteEmail.trim()) return;
    setIsSendingInvite(true);
    const success = await createEmailInvite(inviteEmail.trim());
    if (success) setInviteEmail("");
    setIsSendingInvite(false);
  };

  if (!activeOrganization || !membership) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isFounder = membership.role === "founder";
  const isAdmin = membership.role === "admin" || isFounder;

  return (
    <div className="space-y-6 max-w-3xl">
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            Allmänt
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Medlemmar
          </TabsTrigger>
          <TabsTrigger value="invites">
            <Mail className="h-4 w-4 mr-2" />
            Inbjudningar
          </TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Organisationsdetaljer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <ProfileImageUpload
                  userId={activeOrganization.id}
                  currentUrl={activeOrganization.logo_url}
                  type="company_logo"
                  onUploadComplete={(url) => updateOrganization({ logo_url: url })}
                  size="lg"
                />
                <div className="flex-1">
                  <Label>Organisationsnamn</Label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSaveSettings} disabled={isSaving || orgName === activeOrganization.name}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Spara
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Inbjudningsinställningar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Inbjudningslänk aktiv</p>
                  <p className="text-sm text-muted-foreground">Tillåt nya medlemmar via länk</p>
                </div>
                <Switch
                  checked={inviteLinkEnabled}
                  onCheckedChange={(checked) => {
                    setInviteLinkEnabled(checked);
                    updateOrganization({ invite_link_enabled: checked });
                  }}
                />
              </div>
              {inviteLinkEnabled && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Kod</p>
                      <p className="font-mono">{activeOrganization.invite_code}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyInviteCode}>
                      <Copy className="h-4 w-4 mr-1" />
                      Kopiera
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Länk</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {window.location.origin}/join/{activeOrganization.invite_code}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleCopyInviteLink}>
                      <Copy className="h-4 w-4 mr-1" />
                      Kopiera
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members */}
        <TabsContent value="members" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medlemmar ({members.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user_avatar || undefined} />
                      <AvatarFallback>{member.user_email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{member.user_email}</p>
                        {member.role === "founder" && (
                          <Badge className="bg-yellow-500 text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Grundare
                          </Badge>
                        )}
                        {member.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {isAdmin && member.role !== "founder" && member.user_id !== user?.id && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ta bort medlem?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeMember(member.id)}>
                            Ta bort
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invites */}
        <TabsContent value="invites" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bjud in via e-post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="e-post@exempel.se"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <Button onClick={handleSendEmailInvite} disabled={isSendingInvite || !inviteEmail.trim()}>
                  {isSendingInvite ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {invites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Väntande inbjudningar</CardTitle>
              </CardHeader>
              <CardContent>
                {invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <span className="text-sm">{invite.email}</span>
                    <Badge variant="outline">Väntande</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationContent;
