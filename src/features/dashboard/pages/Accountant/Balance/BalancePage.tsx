import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Balance from "@/features/dashboard/components/pages/Accountant/Balance/Balanca.tsx";

const BalancePage = () => {
  return (
    <DashboardLayout>
      <Balance />
    </DashboardLayout>
  );
};

export default BalancePage;
