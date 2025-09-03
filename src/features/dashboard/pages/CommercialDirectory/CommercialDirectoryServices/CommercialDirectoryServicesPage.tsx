import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import CommercialDirectoryServices from "@/features/dashboard/components/pages/CommercialDirectory/Services/CommercialDirectoryServices.tsx";
const CommercialDirectoryServicesPage = () => {
  return (
    <DashboardLayout>
      <CommercialDirectoryServices />
    </DashboardLayout>
  );
};

export default CommercialDirectoryServicesPage;
