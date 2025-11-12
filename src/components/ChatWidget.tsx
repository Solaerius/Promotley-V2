import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TypingIndicator from "./TypingIndicator";

interface Message {
  id: string;
  message: string;
  sender_type: "user" | "support" | "system";
  created_at: string;
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversationId = localStorage.getItem("chat_conversation_id");
    if (savedConversationId) {
      setConversationId(savedConversationId);
      loadMessages(savedConversationId);
    }
  }, []);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          
          // Show typing indicator for support messages
          if (newMessage.sender_type === "support") {
            setIsTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async (convId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
    } else if (data) {
      setMessages(data as Message[]);
    }
  };

  const createConversation = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_name: "Gäst",
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Fel",
        description: "Kunde inte starta konversation",
        variant: "destructive",
      });
      return null;
    }

    localStorage.setItem("chat_conversation_id", data.id);
    setConversationId(data.id);
    
    // Send welcome message
    await supabase.from("chat_messages").insert({
      conversation_id: data.id,
      sender_type: "system",
      message: "Hej! 👋 Hur kan vi hjälpa dig idag?",
    });

    return data.id;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    let currentConvId = conversationId;

    // Create conversation if it doesn't exist
    if (!currentConvId) {
      currentConvId = await createConversation();
      if (!currentConvId) {
        setIsLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("chat_messages").insert({
      conversation_id: currentConvId,
      sender_type: "user",
      message: inputValue,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Fel",
        description: "Kunde inte skicka meddelande",
        variant: "destructive",
      });
    } else {
      setInputValue("");
      // Simulate support typing
      setTimeout(() => setIsTyping(true), 500);
    }

    setIsLoading(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!conversationId && messages.length === 0) {
      createConversation();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(280,100%,70%)] text-white shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          aria-label="Öppna chat"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[hsl(140,80%,50%)] rounded-full animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] bg-background/95 backdrop-blur-xl rounded-2xl shadow-elegant border border-border/50 flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(280,100%,70%)] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Promotely Support</h3>
                <p className="text-xs text-white/80">
                  Online • Svarar snabbt
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Stäng chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender_type === "user"
                        ? "bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(280,100%,70%)] text-white rounded-br-sm"
                        : message.sender_type === "system"
                        ? "bg-muted/50 text-muted-foreground text-center w-full"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_type === "user"
                          ? "text-white/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString("sv-SE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Skriv ditt meddelande..."
                className="flex-1 bg-background"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(280,100%,70%)] hover:shadow-glow"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
