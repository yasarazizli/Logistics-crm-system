import AuthLayout from "../components/layout/AuthLayout.tsx";
import VerifyRedirect from "@/features/auth/components/pages/RegisterSuccess/VerifyRedirect/VerifyRedirect.tsx";

const VerifyRedirectPage = () => <AuthLayout children={<VerifyRedirect />} />;

export default VerifyRedirectPage;
