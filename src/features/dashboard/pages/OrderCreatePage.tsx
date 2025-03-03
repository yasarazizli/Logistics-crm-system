import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import OrderEditor from "@/features/dashboard/components/pages/OrderEditor/OrderEditor.tsx";

const OrderCreatePage = () => {
  return (
    <DashboardLayout>
      <OrderEditor />
    </DashboardLayout>
  );
};

export default OrderCreatePage;
