import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Home from "@/features/dashboard/components/pages/Home/Home.tsx";

const HomePage = () => {
  return (
    <DashboardLayout>
      <Home />
    </DashboardLayout>
  );
};

export default HomePage;
