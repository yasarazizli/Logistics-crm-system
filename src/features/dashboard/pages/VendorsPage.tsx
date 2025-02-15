import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Vendors from "@/features/dashboard/components/pages/Vendors/Vendors.tsx";

const VendorsPage = () => {
  return (
    <DashboardLayout>
      <Vendors />
    </DashboardLayout>
  );
};

export default VendorsPage;
