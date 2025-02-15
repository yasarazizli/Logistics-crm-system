import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Settings from "@/features/dashboard/components/pages/Settings/Settings.tsx";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsPage;
