import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CreateOrganization() {
  const { createOrganization, loading: orgLoading } = useOrganization();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isLoading = authLoading || orgLoading;
  const isSessionReady = !!session;

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;
    
    setError(null);

    if (!isSessionReady) {
      setError("Sessionen är inte redo. Vänta en stund och försök igen.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orgId = await createOrganization(orgName.trim());
      if (orgId) {
        navigate("/dashboard");
      } else {
        setError("Kunde inte skapa organisationen. Försök igen.");
      }
    } catch (err) {
      console.error("Create org error:", err);
      setError("Ett oväntat fel uppstod. Försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg border-border/50">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <img src={logo} alt="Promotely Logo" className="w-12 h-12" />
            <span className="font-bold text-2xl">Promotely</span>
          </Link>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Skapa ny organisation
          </CardTitle>
          <CardDescription>
            Skapa en ny organisation för att börja samarbeta
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center py-8 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Laddar...</p>
            </div>
          ) : (
            <form onSubmit={handleCreateOrg} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isSessionReady && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Väntar på att sessionen ska laddas...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="orgName">Organisationsnamn</Label>
                <Input
                  id="orgName"
                  placeholder="T.ex. Mitt UF-företag"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={isSubmitting || !isSessionReady}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Du kan ändra detta senare i inställningarna
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">Som grundare kan du:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Bjuda in teammedlemmar</li>
                  <li>• Hantera behörigheter för alla</li>
                  <li>• Koppla sociala medier-konton</li>
                  <li>• Använda alla AI-funktioner</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tillbaka
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={isSubmitting || !orgName.trim() || !isSessionReady}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Skapar...
                    </>
                  ) : (
                    <>
                      Skapa organisation
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
