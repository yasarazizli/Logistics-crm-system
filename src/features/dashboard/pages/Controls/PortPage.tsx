import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Port from "@/features/dashboard/components/pages/Controls/Port/Port.tsx";

const ControlsPage = () => {
  return (
    <DashboardLayout>
      <Port />
    </DashboardLayout>
  );
};

export default ControlsPage;
