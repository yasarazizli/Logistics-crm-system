import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerVerifyResponse } from "@/features/auth/services/auth.service";
import { LoaderContext } from "@/contexts/LoaderContext";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error";

const VerifyRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { setLoader } = useContext(LoaderContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const lang = window.location.pathname.split("/")[1] || "en";

      if (!token) {
        navigate(`/${lang}/auth/registerexpired`);
        return;
      }

      setLoader(true);
      try {
        const { status, data } = await registerVerifyResponse(token);
        console.log("VERIFY RESPONSE:", status, data);

        if (status === 200) {
          navigate(`/${lang}/auth/registersuccess?verified=true`, {
            replace: true,
          });
        } else {
          navigate(`/${lang}/auth/registerexpired?token=${token}`, {
            replace: true,
          });
        }
      } catch (error: any) {
        const errorText = error.response?.data?.error?.toLowerCase() || "";
        if (
          errorText.includes("expired") ||
          errorText.includes("invalid") ||
          errorText.includes("token")
        ) {
          navigate(`/${lang}/auth/registerexpired?token=${token}`, {
            replace: true,
          });
        } else {
          toast.error(errorMessageHandler(error.response?.data));
        }
      } finally {
        setLoader(false);
      }
    };

    verify();
  }, [token, navigate, setLoader]);

  return (
    <p style={{ textAlign: "center", marginTop: "100px" }}>
      Verifying your account...
    </p>
  );
};

export default VerifyRedirect;
