import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Profile from "@/features/dashboard/components/pages/Profile/Profile.tsx";

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <Profile />
    </DashboardLayout>
  );
};

export default ProfilePage;
