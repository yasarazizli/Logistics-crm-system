import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import CommercialDirectory from "@/features/dashboard/components/pages/CommercialDirectory/Users/CommercialDirectoryUsers.tsx";
const CommercialDirectoryUserPage = () => {
  return (
    <DashboardLayout>
      <CommercialDirectory />
    </DashboardLayout>
  );
};

export default CommercialDirectoryUserPage;
