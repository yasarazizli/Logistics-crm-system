import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Tasks from "@/features/dashboard/components/pages/BuyersManager/Tasks/Tasks.tsx";
const ManagerTasksPage = () => {
  return (
    <DashboardLayout>
      <Tasks />
    </DashboardLayout>
  );
};

export default ManagerTasksPage;
