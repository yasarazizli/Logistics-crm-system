import AuthLayout from "../components/layout/AuthLayout.tsx";
import RegisterSuccess from "@/features/auth/components/pages/RegisterSuccess/RegisterSuccess.tsx";

const SuccessPage = () => (
  <AuthLayout children={<RegisterSuccess />} changeSide />
);

export default SuccessPage;
