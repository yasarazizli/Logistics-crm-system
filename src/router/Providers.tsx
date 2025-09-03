// Provider
import { LoaderProvider } from "../contexts/LoaderContext.tsx";
import { AuthProvider } from "../contexts/AuthContext.tsx";

// Interface
import { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <LoaderProvider>{children}</LoaderProvider>
    </AuthProvider>
  );
};

export default Providers;
