import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Users from "@/features/dashboard/components/pages/Users/Users.tsx";

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <Users />
    </DashboardLayout>
  );
};

export default ProfilePage;
