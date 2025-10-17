import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Monitoring from "@/features/dashboard/components/pages/Monitoring/Monitoring.tsx";

const MonitoringPage = () => {
  return (
    <DashboardLayout>
      <Monitoring />
    </DashboardLayout>
  );
};

export default MonitoringPage;
