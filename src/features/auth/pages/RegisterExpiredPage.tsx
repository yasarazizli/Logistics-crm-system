import AuthLayout from "../components/layout/AuthLayout.tsx";
import RegisterExpired from "@/features/auth/components/pages/RegisterSuccess/RegisterExpired/RegisterExpired.tsx";

const RegisterExpiredPage = () => <AuthLayout children={<RegisterExpired />} />;

export default RegisterExpiredPage;
