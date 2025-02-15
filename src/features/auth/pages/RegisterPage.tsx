import AuthLayout from "../components/layout/AuthLayout.tsx";
import Register from "../components/pages/Register/Register.tsx";

const RegisterPage = () =>  <AuthLayout children={<Register />} changeSide={true} />;

export default RegisterPage;