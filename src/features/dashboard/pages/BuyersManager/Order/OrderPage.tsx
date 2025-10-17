import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Order from "@/features/dashboard/components/pages/BuyersManager/Order/Order.tsx";
const OrderPage = () => {
  return (
    <DashboardLayout>
      <Order />
    </DashboardLayout>
  );
};

export default OrderPage;
