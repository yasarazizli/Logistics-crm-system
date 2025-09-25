import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import CommercialManagerOrder from "@/features/dashboard/components/pages/CommercialManager/Order/CommercialManagerOrder.tsx";
const CommercialManagerOrderPage = () => {
  return (
    <DashboardLayout>
      <CommercialManagerOrder />
    </DashboardLayout>
  );
};

export default CommercialManagerOrderPage;
