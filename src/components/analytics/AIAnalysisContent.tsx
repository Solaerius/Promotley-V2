import { useState } from 'react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { useAIProfile } from '@/hooks/useAIProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Calendar, Target, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const AIAnalysisContent = () => {
  const { latestAnalysis, loading, generating, generateAnalysis } = useAIAnalysis();
  const { profile: aiProfile, loading: aiProfileLoading } = useAIProfile();
  const [hasAccess, setHasAccess] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  const filledFields = aiProfile ? [
    aiProfile.branch,
    aiProfile.malgrupp,
    aiProfile.produkt_beskrivning,
    aiProfile.malsattning
  ].filter(Boolean).length : 0;
  
  const isAIProfileComplete = filledFields >= 3;
  const isAIBlocked = !isAIProfileComplete && !aiProfileLoading;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'hög': return 'destructive';
      case 'medel': return 'default';
      case 'låg': return 'secondary';
      default: return 'outline';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'tiktok': return 'bg-black';
      case 'facebook': return 'bg-blue-600';
      default: return 'bg-primary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-muted-foreground">
            Få skräddarsydda rekommendationer baserat på UF-regler
          </p>
        </div>
        <Button
          onClick={async () => {
            try {
              await generateAnalysis();
              setHasAccess(true);
              setAccessError(null);
            } catch (error: any) {
              if (error?.message?.includes('NO_ACTIVE_PLAN')) {
                setHasAccess(false);
                setAccessError('no_plan');
              } else if (error?.message?.includes('INSUFFICIENT_CREDITS')) {
                setHasAccess(false);
                setAccessError('no_credits');
              }
            }
          }}
          disabled={generating || !hasAccess || isAIBlocked}
          size="lg"
          className="gap-2"
        >
          <Sparkles className="h-5 w-5" />
          {generating ? 'Genererar...' : isAIBlocked ? 'Fyll i AI-profil först' : 'Generera Analys'}
        </Button>
      </div>

      {/* Warnings */}
      {!hasAccess && accessError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              {accessError === 'no_plan' && 'Du behöver ett aktivt paket för AI-analys'}
              {accessError === 'no_credits' && 'Dina krediter är slut'}
            </span>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/pricing'}>
              Visa paket
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isAIBlocked && hasAccess && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            <p className="font-bold mb-1">AI-profil krävs!</p>
            <p>Fyll i minst 3 fält i din AI-profil under Konto → AI-profil.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* No Analysis State */}
      {!latestAnalysis ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ingen analys genererad än</h3>
              <p className="text-muted-foreground">
                Klicka på "Generera Analys" för att få din AI-drivna marknadsföringsplan
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Sammanfattning
              </CardTitle>
              <CardDescription>
                Genererad {new Date(latestAnalysis.created_at).toLocaleDateString('sv-SE')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer content={latestAnalysis.ai_output?.sammanfattning ?? ''} />
            </CardContent>
          </Card>

          {/* Social Media Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Analys av Sociala Medier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer content={latestAnalysis.ai_output?.social_medier_analys ?? ''} />
            </CardContent>
          </Card>

          {/* 7-Day Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                7-Dagars Handlingsplan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(latestAnalysis.ai_output?.["7_dagars_plan"] ?? []).map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{item.dag}</h4>
                      <Badge className={getPlatformColor(item.plattform)}>{item.plattform}</Badge>
                    </div>
                    <p className="font-medium mb-1">{item.aktivitet}</p>
                    <p className="text-sm text-muted-foreground">{item.beskrivning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Content-Förslag
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {(latestAnalysis.ai_output?.content_forslag ?? []).map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{item.titel}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">{item.format}</Badge>
                        <Badge className={getPlatformColor(item.plattform)}>{item.plattform}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.beskrivning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* UF Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                UF-Tävlingsstrategi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer content={latestAnalysis.ai_output?.uf_tavlingsstrategi ?? ''} />
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Rekommendationer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(latestAnalysis.ai_output?.rekommendationer ?? []).map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityColor(item.prioritet)}>{item.prioritet}</Badge>
                      <Badge variant="outline">{item.kategori}</Badge>
                    </div>
                    <h4 className="font-semibold text-lg">{item.titel}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.beskrivning}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Deadline:</strong> {item.deadline}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AIAnalysisContent;
