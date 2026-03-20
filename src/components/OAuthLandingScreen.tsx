import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import logo from "@/assets/logo.png";

export default function OAuthLandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2">
        <img src={logo} alt="Promotley" className="h-10 w-10" />
        <span className="font-bold text-xl">Promotley</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Välkommen!</h1>
        <p className="text-muted-foreground">Hur vill du komma igång?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Register company */}
        <button
          onClick={() => navigate("/organization/new")}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Registrera ett företag</p>
            <p className="text-xs text-muted-foreground">
              Skapa och anpassa din organisation
            </p>
          </div>
        </button>

        {/* Join company */}
        <button
          onClick={() => navigate("/organization/onboarding")}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Anslut till ett företag</p>
            <p className="text-xs text-muted-foreground">
              Gå med i ett befintligt team med en inbjudningskod
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
