import DashboardLayout from "@/components/layouts/DashboardLayout";
import AnalyticsContent from "@/components/analytics/AnalyticsContent";

const AnalyticsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4 max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Statistik</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Oversikt av dina sociala medier</p>
        </div>
        <AnalyticsContent />
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
