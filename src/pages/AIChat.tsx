import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Send,
  Sparkles,
  BarChart3,
  Calendar,
  FileText,
  TrendingUp,
  Paperclip,
  Loader2,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useAIProfile } from "@/hooks/useAIProfile";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import MarketingPlanCard from "@/components/MarketingPlanCard";
import CreditsDisplay from "@/components/CreditsDisplay";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  sender: "user" | "ai";
  message: string;
  timestamp: Date;
  plan?: any;
}

const AIChat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { messages, loading, sendMessage, implementPlan } = useAIAssistant(null);
  const { credits } = useUserCredits();
  const { profile: aiProfile, loading: aiProfileLoading } = useAIProfile();
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const hasInsufficientCredits = credits && credits.credits_left <= 0;

  const filledFields = aiProfile ? [
    aiProfile.branch,
    aiProfile.malgrupp,
    aiProfile.produkt_beskrivning,
    aiProfile.malsattning
  ].filter(Boolean).length : 0;

  const isAIProfileComplete = filledFields >= 3;
  const isAIBlocked = !isAIProfileComplete && !aiProfileLoading;

  const quickCommands = [
    { icon: BarChart3, text: "Analysera min statistik" },
    { icon: Calendar, text: "Skapa marknadsforingsplan" },
    { icon: FileText, text: "Skriv caption" },
    { icon: TrendingUp, text: "Skapa 30-dagars strategi" },
  ];

  const checkIfNearBottom = () => {
    const element = scrollRef.current;
    if (!element) return false;
    const threshold = 80;
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    return scrollBottom < threshold;
  };

  const handleScroll = () => {
    const nearBottom = checkIfNearBottom();
    setIsNearBottom(nearBottom);
    setShowScrollButton(!nearBottom && messages.length > 0);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isNearBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isNearBottom]);

  const getLatestPlan = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i] as any;
      if (msg.plan) return { plan: msg.plan, requestId: msg.requestId || `plan-${msg.id}` };
    }
    return null;
  };

  const handleSendMessage = async (text?: string, meta?: any) => {
    const messageText = text || inputMessage.trim();
    if (!messageText || loading) return;

    if (hasInsufficientCredits) {
      toast({ title: "Otillrackliga krediter", description: "Du har slut pa krediter.", variant: "destructive" });
      return;
    }

    try {
      await sendMessage(messageText, meta);
      setInputMessage("");
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error?.message?.includes('INSUFFICIENT_CREDITS')) {
        toast({ title: "Otillrackliga krediter", description: "Du har inte tillrackligt med krediter.", variant: "destructive" });
      }
    }
  };

  const handleQuickCommand = async (command: string) => {
    if (loading) return;
    if (hasInsufficientCredits) {
      toast({ title: "Otillrackliga krediter", description: "Du har slut pa krediter.", variant: "destructive" });
      return;
    }

    switch (command) {
      case "Analysera min statistik":
        await handleSendMessage("Analysera min statistik och ge mig insikter om mina sociala medier-konton.");
        break;
      case "Skapa marknadsforingsplan":
        await handleSendMessage(
          "Skapa en marknadsforingsplan for kommande 4 veckor som maximerar rackvidd och engagemang. Utga fran min kalender och foretagsprofil.",
          { action: 'create_marketing_plan', timeframe: { preset: 'next_4_weeks' }, targets: ['reach', 'engagement'], requestId: crypto.randomUUID() }
        );
        break;
      case "Skriv caption":
        setInputMessage("Skriv en engagerande caption for mitt nasta inlagg om ");
        break;
      case "Skapa 30-dagars strategi":
        await handleSendMessage("Skapa en 30-dagars strategi for att oka min synlighet pa sociala medier. Inkludera konkreta aktiviteter och mal.");
        break;
      default:
        setInputMessage(command);
    }
  };

  const handleImplementPlan = async (plan: any, requestId: string) => {
    setPendingPlan({ plan, requestId });
    setShowConfirmDialog(true);
  };

  const confirmImplementPlan = async () => {
    if (!pendingPlan) return;
    setShowConfirmDialog(false);
    try {
      await implementPlan(pendingPlan.plan, pendingPlan.requestId);
      toast({ title: "Plan implementerad", description: `${pendingPlan.plan.posts?.length || 0} inlagg har lagts till i din kalender.` });
    } catch (error) {
      console.error('Error implementing plan:', error);
      toast({ title: "Fel", description: "Kunde inte implementera planen.", variant: "destructive" });
    } finally {
      setPendingPlan(null);
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] min-h-[680px] md:min-h-[780px] flex flex-col max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI-Assistent</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Chatta med Promotleys AI for personliga rad</p>
          </div>
          <CreditsDisplay variant="compact" />
        </div>

        {/* AI Profile Warning */}
        {isAIBlocked && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-medium">AI-profil kravs</AlertTitle>
            <AlertDescription className="mt-1">
              <p className="text-sm mb-2">Fyll i minst 3 av foljande falt i din AI-profil: bransch, malgrupp, produktbeskrivning och malsattning.</p>
              <Button onClick={() => navigate('/account')} variant="outline" size="sm">
                Ga till Installningar
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Commands */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {quickCommands.map((cmd, index) => {
            const Icon = cmd.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow text-left disabled:opacity-50"
                onClick={() => handleQuickCommand(cmd.text)}
                disabled={loading || isAIBlocked}
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground">{cmd.text}</span>
              </button>
            );
          })}
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden rounded-xl bg-card shadow-sm">
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 md:p-6"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] lg:max-w-[65%]`}>
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Promotley AI</span>
                      </div>
                    )}
                    <div className={`rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      {msg.role === "user" ? (
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      ) : (
                        <MarkdownRenderer content={msg.message} />
                      )}
                      <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {formatTime(new Date(msg.timestamp))}
                      </p>
                    </div>

                    {msg.plan && (
                      <div className="mt-3">
                        <MarketingPlanCard plan={msg.plan} onImplement={handleImplementPlan} />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] lg:max-w-[65%]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Promotley AI tanker...</span>
                    </div>
                    <div className="rounded-xl px-4 py-3 bg-muted">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scroll to bottom */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-24 right-8 bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow flex items-center gap-1.5 z-10 text-sm"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              Nya meddelanden
            </button>
          )}

          {/* Insufficient Credits */}
          {hasInsufficientCredits && (
            <div className="border-t border-border p-3">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-sm">Du har slut pa krediter.</span>
                  <Button variant="outline" size="sm" onClick={() => navigate('/pricing')} className="ml-4">Uppgradera</Button>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-3 md:p-4">
            <div className="flex gap-2 items-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toast({ title: "Filuppladdning", description: "Kommer snart!" })}
                disabled={hasInsufficientCredits || isAIBlocked}
                className="shrink-0 h-9 w-9"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Textarea
                placeholder={isAIBlocked ? "Fyll i AI-profil forst..." : hasInsufficientCredits ? "Inga krediter kvar..." : "Skriv ditt meddelande..."}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !hasInsufficientCredits && !isAIBlocked) {
                    e.preventDefault();
                    handleSendMessage();
                    e.currentTarget.style.height = 'auto';
                  }
                }}
                className="flex-1 min-h-[40px] max-h-[150px] resize-none py-2 bg-muted border-0 focus-visible:ring-1"
                disabled={hasInsufficientCredits || loading || isAIBlocked}
                rows={1}
              />
              <Button
                size="icon"
                onClick={() => {
                  handleSendMessage();
                  const textarea = document.querySelector('textarea');
                  if (textarea) textarea.style.height = 'auto';
                }}
                disabled={!inputMessage.trim() || loading || hasInsufficientCredits || isAIBlocked}
                className="shrink-0 h-9 w-9"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
              {isAIBlocked
                ? "Fyll i din AI-profil i Installningar for att borja chatta"
                : hasInsufficientCredits
                ? "Uppgradera din plan for att fortsatta chatta med AI"
                : "AI kan gora misstag. Kontrollera viktig information."}
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Implementera marknadsforingsplan?</DialogTitle>
            <DialogDescription>
              {pendingPlan && (
                <>Vill du lagga in {pendingPlan.plan.posts?.length || 0} inlagg i din kalender mellan {pendingPlan.plan.timeframe?.start} och {pendingPlan.plan.timeframe?.end}?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Avbryt</Button>
            <Button onClick={confirmImplementPlan}>Implementera</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AIChat;
