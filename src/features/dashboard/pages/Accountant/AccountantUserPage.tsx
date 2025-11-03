import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import AccountantUser from "@/features/dashboard/components/pages/Accountant/AccountantUser.tsx";

const AccountantUserPage = () => {
  return (
    <DashboardLayout>
      <AccountantUser />
    </DashboardLayout>
  );
};

export default AccountantUserPage;
