import { Coins, Sparkles } from 'lucide-react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CreditsDisplayProps {
  variant?: 'compact' | 'full';
  showUpgrade?: boolean;
}

const CreditsDisplay = ({ variant = 'compact', showUpgrade = true }: CreditsDisplayProps) => {
  const { credits, loading, getPlanLabel } = useUserCredits();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <Coins className="w-4 h-4" />
        <span className="text-sm">Laddar...</span>
      </div>
    );
  }

  if (!credits) return null;

  const percentage = credits.max_credits > 0 
    ? (credits.credits_left / credits.max_credits) * 100 
    : 0;

  const isLow = credits.credits_left <= 5;
  const isUnlimited = credits.plan === 'pro_unlimited';

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
        isLow && !isUnlimited
          ? 'bg-destructive/10 text-destructive' 
          : 'bg-primary/10 text-primary'
      }`}>
        <Sparkles className="w-4 h-4" />
        {isUnlimited ? (
          <span>Obegränsade krediter</span>
        ) : (
          <span>{credits.credits_left} krediter</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isLow && !isUnlimited ? 'bg-destructive/10' : 'bg-primary/10'
          }`}>
            <Coins className={`w-4 h-4 ${isLow && !isUnlimited ? 'text-destructive' : 'text-primary'}`} />
          </div>
          <div>
            <p className="font-medium">AI-krediter</p>
            <p className="text-xs text-muted-foreground">{getPlanLabel(credits.plan)}</p>
          </div>
        </div>
        <div className="text-right">
          {isUnlimited ? (
            <p className="text-lg font-bold text-primary">∞</p>
          ) : (
            <>
              <p className={`text-lg font-bold ${isLow ? 'text-destructive' : ''}`}>
                {credits.credits_left}
              </p>
              <p className="text-xs text-muted-foreground">av {credits.max_credits}</p>
            </>
          )}
        </div>
      </div>

      {!isUnlimited && (
        <Progress 
          value={percentage} 
          className={`h-2 ${isLow ? '[&>div]:bg-destructive' : ''}`}
        />
      )}

      {isLow && !isUnlimited && showUpgrade && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate('/pricing')}
        >
          Uppgradera för fler krediter
        </Button>
      )}

      {credits.renewal_date && !isUnlimited && (
        <p className="text-xs text-muted-foreground text-center">
          Förnyas {new Date(credits.renewal_date).toLocaleDateString('sv-SE')}
        </p>
      )}
    </div>
  );
};

export default CreditsDisplay;
