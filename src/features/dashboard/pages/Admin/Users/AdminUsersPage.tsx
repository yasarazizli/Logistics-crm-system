import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Users from "@/features/dashboard/components/pages/Admin/Users.tsx";
const AdminUsersPage = () => {
  return (
    <DashboardLayout>
      <Users />
    </DashboardLayout>
  );
};

export default AdminUsersPage;
