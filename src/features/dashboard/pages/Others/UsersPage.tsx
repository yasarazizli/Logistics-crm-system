import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Users from "@/features/dashboard/components/pages/Users/Users.tsx";

const UserPage = () => {
  return (
    <DashboardLayout>
      <Users />
    </DashboardLayout>
  );
};

export default UserPage;
