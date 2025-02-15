import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import BalanceActivities from "@/features/dashboard/components/pages/BalanceActivities/BalanceActivities.tsx";

const BalanceActivitiesPage = () => {
  return (
    <DashboardLayout>
      <BalanceActivities />
    </DashboardLayout>
  );
};

export default BalanceActivitiesPage;
