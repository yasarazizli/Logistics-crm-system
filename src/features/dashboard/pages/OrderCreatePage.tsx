import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import OrderCreate from "@/features/dashboard/components/pages/Order/OrderCreate/OrderCreate.tsx";

const OrderCreatePage = () => {
  return (
    <DashboardLayout>
      <OrderCreate />
    </DashboardLayout>
  );
};

export default OrderCreatePage;
