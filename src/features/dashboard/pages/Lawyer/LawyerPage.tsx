import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import LawyerUsers from "@/features/dashboard/components/pages/LawyerUsers/LawyerUsers.tsx";

const ControlsPage = () => {
  return (
    <DashboardLayout>
      <LawyerUsers />
    </DashboardLayout>
  );
};

export default ControlsPage;
