import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Orders from "@/features/dashboard/components/pages/CommercialDirectory/Order/Orders.tsx";
const OrdersPage = () => {
  return (
    <DashboardLayout>
      <Orders />
    </DashboardLayout>
  );
};

export default OrdersPage;
