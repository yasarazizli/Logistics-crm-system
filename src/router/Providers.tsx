// Provider
import { LoaderProvider } from "../contexts/LoaderContext.tsx";
import { AuthProvider } from "../contexts/AuthContext.tsx";

// Interface
import { PropsWithChildren } from "react";
import { DataProvider } from "@/contexts/DataContext.tsx";
import { ThemeProvider } from "@/contexts/ThemeContext.tsx";
import { StoreProvider } from "@/contexts/StoreContext.tsx";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LoaderProvider>
          <StoreProvider>
            <DataProvider>{children}</DataProvider>
          </StoreProvider>
        </LoaderProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Providers;
