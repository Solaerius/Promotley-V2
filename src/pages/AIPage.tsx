import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Wand2 } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { motion } from "framer-motion";

// Import content components
import AIChatContent from "@/components/ai/AIChatContent";
import AIToolsContent from "@/components/ai/AIToolsContent";

const AIPage = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in h-full">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">AI-Assistent</h1>
          <p className="text-muted-foreground">
            Din personliga AI för marknadsföring och innehåll
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI-Chat
            </TabsTrigger>
            <TabsTrigger value="verktyg" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              AI-Verktyg
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <TabsContent value="chat" className="mt-6 h-full">
              <AIChatContent />
            </TabsContent>

            <TabsContent value="verktyg" className="mt-6">
              <AIToolsContent />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIPage;
