import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building2, Settings, Palette } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { motion } from "framer-motion";

// Import content components
import AccountContent from "@/components/account/AccountContent";
import OrganizationContent from "@/components/account/OrganizationContent";
import AppSettingsContent from "@/components/account/AppSettingsContent";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("konto");

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Konto & Inställningar</h1>
          <p className="text-muted-foreground">
            Hantera ditt konto, organisation och appinställningar
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="konto" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Konto
            </TabsTrigger>
            <TabsTrigger value="organisation" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organisation
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              App
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="konto" className="mt-6">
              <AccountContent />
            </TabsContent>

            <TabsContent value="organisation" className="mt-6">
              <OrganizationContent />
            </TabsContent>

            <TabsContent value="app" className="mt-6">
              <AppSettingsContent />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AccountPage;
