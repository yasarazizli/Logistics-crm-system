import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Station from "@/features/dashboard/components/pages/Controls/Station/Station.tsx";

const StationPage = () => {
  return (
    <DashboardLayout>
      <Station />
    </DashboardLayout>
  );
};

export default StationPage;
