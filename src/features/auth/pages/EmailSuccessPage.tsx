import AuthLayout from "../components/layout/AuthLayout.tsx";
import EmailSuccess from "@/features/auth/components/pages/EmailSuccess/EmailSuccess.tsx";

const EmailSuccessPage = () => (
  <AuthLayout children={<EmailSuccess />} changeSide />
);

export default EmailSuccessPage;
