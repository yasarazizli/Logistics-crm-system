import AuthLayout from "../components/layout/AuthLayout.tsx";
import Login from "../components/pages/Login/Login.tsx";

const LoginPage = () =>  <AuthLayout children={ <Login />} />

export default LoginPage;