import AuthLayout from "../components/layout/AuthLayout.tsx";
import Success from "../components/pages/Success/Success.tsx";

const SuccessPage = () => <AuthLayout children={<Success />} changeSide />;

export default SuccessPage;
