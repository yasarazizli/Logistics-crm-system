import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Notification from "@/features/dashboard/components/pages/Notification/Notification.tsx";

const NotificationPage = () => {
  return (
    <DashboardLayout>
      <Notification />
    </DashboardLayout>
  );
};

export default NotificationPage;
