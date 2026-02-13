import { useAIProfile } from "@/hooks/useAIProfile";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AIProfileProgressProps {
  compact?: boolean;
}

export const AIProfileProgress = ({ compact = false }: AIProfileProgressProps) => {
  const { profile, loading } = useAIProfile();

  if (loading) return null;

  const fields = [
    { key: "foretagsnamn", label: "Företagsnamn" },
    { key: "branch", label: "Bransch" },
    { key: "stad", label: "Stad" },
    { key: "postnummer", label: "Postnummer" },
    { key: "malgrupp", label: "Målgrupp" },
    { key: "produkt_beskrivning", label: "Företagsbeskrivning" },
  ];

  const filledFields = fields.filter(
    (f) => profile?.[f.key as keyof typeof profile] && String(profile[f.key as keyof typeof profile]).trim() !== ""
  ).length;

  const progress = (filledFields / fields.length) * 100;
  const isComplete = filledFields >= fields.length;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isComplete ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
        <span className="text-sm text-muted-foreground">
          AI-profil: {filledFields}/{fields.length} fält
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">AI-profil status</h4>
        {isComplete ? (
          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
            Redo
          </span>
        ) : (
          <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            Ofullständig
          </span>
        )}
      </div>
      
      <Progress value={progress} className="h-2 mb-3" />
      
      <div className="space-y-1">
        {fields.map((field) => {
          const isFilled = profile?.[field.key as keyof typeof profile] && 
            String(profile[field.key as keyof typeof profile]).trim() !== "";
          return (
            <div key={field.key} className="flex items-center gap-2 text-xs">
              {isFilled ? (
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              ) : (
                <div className="h-3 w-3 rounded-full border border-muted-foreground/30" />
              )}
              <span className={isFilled ? "text-foreground" : "text-muted-foreground"}>
                {field.label}
              </span>
            </div>
          );
        })}
      </div>

      {!isComplete && (
        <Link 
          to="/settings" 
          className="block mt-3 text-xs text-primary hover:underline"
        >
          Fyll i alla obligatoriska fält för att låsa upp AI-funktioner →
        </Link>
      )}
    </div>
  );
};
