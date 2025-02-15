import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Tasks from "@/features/dashboard/components/pages/Tasks/Tasks.tsx";

const TasksPage = () => {
  return (
    <DashboardLayout>
      <Tasks />
    </DashboardLayout>
  );
};

export default TasksPage;
