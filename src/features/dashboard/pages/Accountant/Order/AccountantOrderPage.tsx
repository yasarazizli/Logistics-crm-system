import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import AccountantOrder from "@/features/dashboard/components/pages/Accountant/Order/AccountantOrder.tsx";

const AccountantOrderPage = () => {
  return (
    <DashboardLayout>
      <AccountantOrder />
    </DashboardLayout>
  );
};

export default AccountantOrderPage;
