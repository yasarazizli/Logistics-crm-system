import DashboardLayout from "@/features/dashboard/components/layout/DashboardLayout.tsx";
import Country from "@/features/dashboard/components/pages/Controls/Country/Country.tsx";

const CountryPage = () => {
  return (
    <DashboardLayout>
      <Country />
    </DashboardLayout>
  );
};

export default CountryPage;
