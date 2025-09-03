// Provider
import { LoaderProvider } from "../contexts/LoaderContext.tsx";
import { AuthProvider } from "../contexts/AuthContext.tsx";

// Interface
import { PropsWithChildren } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext.tsx";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoaderProvider>{children}</LoaderProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
