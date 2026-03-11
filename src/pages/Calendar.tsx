import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, Plus, Sparkles, Trash2, Edit, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useCalendar } from "@/hooks/useCalendar";
import { useAIProfile } from "@/hooks/useAIProfile";
import { useConversations } from "@/hooks/useConversations";
import { supabase } from "@/integrations/supabase/client";
import CalendarSkeleton from "@/components/CalendarSkeleton";
import CalendarErrorState from "@/components/CalendarErrorState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

type EventType = "inlagg" | "uf_marknad" | "event" | "deadline" | "ovrigt";

const eventTypeLabels: Record<EventType, string> = {
  inlagg: "Inlagg", uf_marknad: "UF-marknad", event: "Event/aktivitet", deadline: "Deadline", ovrigt: "Ovrigt",
};

const eventTypeColors: Record<EventType, string> = {
  inlagg: "bg-pink-500", uf_marknad: "bg-green-500", event: "bg-blue-500", deadline: "bg-orange-500", ovrigt: "bg-gray-500",
};

const Calendar = () => {
  const { toast } = useToast();
  const { posts, loading, error, createPost, updatePost, deletePost, fetchPosts } = useCalendar();
  const { profile: aiProfile } = useAIProfile();
  const { createConversation } = useConversations();

  const aiProfileFields = [aiProfile?.branch, aiProfile?.malgrupp, aiProfile?.produkt_beskrivning, aiProfile?.malsattning];
  const isAIProfileComplete = aiProfileFields.filter(f => f && String(f).trim() !== "").length >= 3;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formData, setFormData] = useState({ date: "", platform: "inlagg", title: "", description: "" });

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const mondayStart = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const days: (number | null)[] = [];
    for (let i = 0; i < mondayStart; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
    return days;
  };

  const handleSavePost = async () => {
    if (!formData.date || !formData.platform || !formData.title) {
      toast({ title: "Fyll i alla obligatoriska falt", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      if (editingPost) await updatePost(editingPost.id, formData);
      else await createPost(formData);
      setIsDialogOpen(false);
      setEditingPost(null);
      setFormData({ date: "", platform: "inlagg", title: "", description: "" });
    } catch (err) { console.error(err); }
    finally { setIsSaving(false); }
  };

  const handleEditPost = (post: any) => { setEditingPost(post); setFormData(post); setIsDialogOpen(true); };

  const handleGenerateContentPlan = async () => {
    if (isGeneratingPlan) return;
    setIsGeneratingPlan(true);
    setGenerationProgress(10);
    try {
      const convId = await createConversation("Marknadsforingsplan");
      if (!convId) throw new Error("Kunde inte skapa konversation");
      const progressInterval = setInterval(() => setGenerationProgress(prev => Math.min(prev + 8, 85)), 800);
      const planMessage = "Skapa en marknadsforingsplan for kommande 4 veckor. Svara ENBART med en plan i JSON-format.";
      await supabase.from('ai_chat_messages').insert({ conversation_id: convId, role: 'user', message: planMessage });
      const { data: contextData } = await supabase.functions.invoke('calendar/context');
      const { data: result, error: invokeError } = await supabase.functions.invoke('ai-assistant/chat', {
        method: 'POST',
        body: { message: planMessage, history: [], calendarContextDigest: contextData?.digest || [], meta: { action: 'create_marketing_plan', timeframe: { preset: 'next_4_weeks' }, targets: ['reach', 'engagement'], requestId: crypto.randomUUID() }, conversationId: convId }
      });
      if (invokeError) throw invokeError;
      await supabase.from('ai_chat_messages').insert({ conversation_id: convId, role: 'assistant', message: result.response, plan: result.plan || null });
      clearInterval(progressInterval);
      setGenerationProgress(100);
      toast({ title: "Plan skapad!", description: "Kolla AI-chatten for detaljer." });
    } catch (err: any) {
      toast({ title: "Fel", description: err?.message?.includes('NO_ACTIVE_PLAN') ? "Du behover ett aktivt paket." : "Kunde inte generera plan.", variant: "destructive" });
    } finally {
      setTimeout(() => { setIsGeneratingPlan(false); setGenerationProgress(0); }, 1500);
    }
  };

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };

  const monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
  const weekDays = ["Man", "Tis", "Ons", "Tor", "Fre", "Lor", "Son"];

  if (loading) return <DashboardLayout><CalendarSkeleton /></DashboardLayout>;
  if (error) return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Innehallskalender</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Planera dina inlagg</p>
        </div>
        <CalendarErrorState error={error} onRetry={fetchPosts} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Innehallskalender</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Planera dina inlagg och hall koll pa din content-strategi</p>
          </div>
          <div className="flex flex-col gap-2">
            {!isAIProfileComplete && (
              <Alert variant="default" className="border-warning/50 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning text-sm">
                  Fyll i din <Link to="/account" className="underline font-medium">AI-profil</Link> for att anvanda AI.
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button onClick={handleGenerateContentPlan} disabled={!isAIProfileComplete || isGeneratingPlan} size="sm">
                {isGeneratingPlan ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
                {isGeneratingPlan ? "Genererar..." : "Skapa plan med AI"}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" onClick={() => { setEditingPost(null); setFormData({ date: "", platform: "inlagg", title: "", description: "" }); }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Lagg till
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>{editingPost ? "Redigera handelse" : "Ny handelse"}</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Datum</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
                    <div>
                      <Label>Typ</Label>
                      <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.entries(eventTypeLabels).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>Titel</Label><Input placeholder="Titel" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
                    <div><Label>Beskrivning</Label><Textarea placeholder="Beskriv innehallet" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
                    <Button onClick={handleSavePost} className="w-full" disabled={isSaving}>
                      {isSaving ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />{editingPost ? "Uppdaterar..." : "Skapar..."}</> : (editingPost ? "Uppdatera" : "Skapa")}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Progress */}
        {isGeneratingPlan && (
          <div className="space-y-2 p-4 rounded-xl bg-card shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Skapar din plan...</span>
              <span className="text-muted-foreground">{Math.round(generationProgress)}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}

        {/* Calendar */}
        <div className="rounded-xl bg-card shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>Foregaende</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Idag</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>Nasta</Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => <div key={day} className="text-center font-medium text-xs text-muted-foreground p-1">{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth().map((day, index) => {
              const dayPosts = day ? getPostsForDate(day) : [];
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              return (
                <div key={index} className={`min-h-[76px] p-1.5 rounded-lg border transition-colors ${day ? (isToday ? "bg-primary/5 border-primary/30" : "bg-card hover:bg-muted border-border") : "bg-transparent border-transparent"}`}>
                  {day && (
                    <>
                      <div className="text-sm font-medium mb-1 text-foreground">{day}</div>
                      <div className="space-y-1">
                        {dayPosts.map((post) => {
                          const eventType = (post as any).event_type as EventType || 'inlagg';
                          return (
                            <div key={post.id} className={`${eventTypeColors[eventType]} text-white text-[10px] p-1 rounded cursor-pointer hover:opacity-90 group relative`} onClick={() => handleEditPost(post)}>
                              <span className="truncate block">{post.title}</span>
                              <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100">
                                <Button variant="ghost" size="icon" className="h-4 w-4 text-white" onClick={(e) => { e.stopPropagation(); deletePost(post.id); }}>
                                  <Trash2 className="w-2.5 h-2.5" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-xl bg-card shadow-sm p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">Kommande inlagg</h3>
          <div className="space-y-2">
            {posts.filter(p => new Date(p.date) >= new Date(new Date().toDateString())).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map((post) => {
              const eventType = (post as any).event_type as EventType || 'inlagg';
              return (
                <div key={post.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${eventTypeColors[eventType]} flex items-center justify-center`}>
                      <CalendarIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditPost(post)}><Edit className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deletePost(post.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              );
            })}
            {posts.length === 0 && <p className="text-center text-sm text-muted-foreground py-6">Inga planerade inlagg annu.</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
