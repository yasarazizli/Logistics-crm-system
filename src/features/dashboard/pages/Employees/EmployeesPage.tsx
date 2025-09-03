import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Employees from "@/features/dashboard/components/pages/Employees/Employees.tsx";

const ControlsPage = () => {
  return (
    <DashboardLayout>
      <Employees />
    </DashboardLayout>
  );
};

export default ControlsPage;
