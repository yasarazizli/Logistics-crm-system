import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import ServicesMonitoring from "@/features/dashboard/components/pages/Monitoring/ServicesMonitoring/ServicesMonitoring.tsx";

const ServicesMonitoringPage = () => {
  return (
    <DashboardLayout>
      <ServicesMonitoring />
    </DashboardLayout>
  );
};

export default ServicesMonitoringPage;
