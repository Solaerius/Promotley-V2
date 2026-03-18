import { useState, useEffect } from "react";
import {
  MessageSquare,
  FileText,
  Hash,
  Image,
  Calendar,
  Target,
  Lightbulb,
  BarChart3,
  Radar,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAIProfile } from "@/hooks/useAIProfile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const tools = [
  {
    icon: FileText,
    title: "Caption-generator",
    description: "Skapa engagerande captions för dina inlägg",
    route: "/ai/caption",
  },
  {
    icon: Hash,
    title: "Hashtag-förslag",
    description: "Få relevanta hashtags för ökad räckvidd",
    route: "/ai/hashtags",
  },
  {
    icon: Image,
    title: "Content-idéer",
    description: "Brainstorma nya innehållsidéer",
    route: "/ai/content-ideas",
  },
  {
    icon: Calendar,
    title: "Veckoplanering",
    description: "Planera din innehållskalender",
    route: "/ai/weekly-plan",
  },
  {
    icon: Target,
    title: "Kampanjstrategi",
    description: "Bygg en strategi för din nästa kampanj",
    route: "/ai/campaign",
  },
  {
    icon: Lightbulb,
    title: "UF-tips",
    description: "Få råd specifikt för UF-företag",
    route: "/ai/uf-tips",
  },
  {
    icon: BarChart3,
    title: "AI-analys",
    description: "Analysera dina sociala medier med AI",
    route: "/ai-dashboard",
  },
  {
    icon: Radar,
    title: "Säljradar",
    description: "Hitta leads och trender i din bransch",
    route: "/ai?tab=radar",
    isInternal: true,
  },
];

const AIPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { profile: aiProfile, loading: aiProfileLoading } = useAIProfile();

  const filledFields = aiProfile
    ? [aiProfile.branch, aiProfile.malgrupp, aiProfile.produkt_beskrivning, aiProfile.malsattning].filter(Boolean).length
    : 0;
  const isAIProfileComplete = filledFields >= 3;
  const isBlocked = !isAIProfileComplete && !aiProfileLoading;

  // If ?tab=radar, could redirect or show radar inline - for now navigate
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "radar") {
      // Keep on this page, radar is shown as a tool card
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-l-4 border-primary pl-3">
          <h1 className="text-2xl font-bold text-foreground">AI-verktyg</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Din personliga AI för marknadsföring och innehåll
          </p>
        </div>

        {/* AI profile warning */}
        {isBlocked && (
          <Alert variant="destructive" className="border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Din AI-profil är inte komplett.{" "}
              <Link to="/account" className="underline font-medium">
                Fyll i den först
              </Link>{" "}
              för att använda AI-funktioner.
            </AlertDescription>
          </Alert>
        )}

        {/* Tools grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 ${isBlocked ? "opacity-50 pointer-events-none" : ""}`}>
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.title}
                onClick={() => navigate(tool.route)}
                className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/40 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 text-left group cursor-pointer"
              >
                <span className="text-[11px] font-bold font-mono text-muted-foreground/50 mt-1 w-5 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 shrink-0">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1.5 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* AI profile tip */}
        <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">AI-profil viktigt!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ju mer du fyller i din AI-profil under Konto, desto bättre svar får du.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIPage;
