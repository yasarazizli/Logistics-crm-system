import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Workers from "@/features/dashboard/components/pages/Workers/Workers.tsx";

const WorkersPage = () => {
  return (
    <DashboardLayout>
      <Workers />
    </DashboardLayout>
  );
};

export default WorkersPage;
