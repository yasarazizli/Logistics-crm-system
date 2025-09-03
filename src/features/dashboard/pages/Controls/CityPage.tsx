import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import City from "@/features/dashboard/components/pages/Controls/City/City.tsx";

const ControlsPage = () => {
  return (
    <DashboardLayout>
      <City />
    </DashboardLayout>
  );
};

export default ControlsPage;
