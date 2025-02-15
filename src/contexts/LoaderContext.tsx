// React
import { createContext, PropsWithChildren, useState } from "react";

// Components
import Loader from "@/components/Loader/Loader.tsx";

export const LoaderContext = createContext<{
  loader: boolean;
  setLoader: (isLoad: boolean) => void;
}>({
  loader: false,
  setLoader: () => {},
});

export const LoaderProvider = ({ children }: PropsWithChildren) => {
  const [loader, setLoader] = useState(false);

  const data = {
    loader,
    setLoader,
  };

  return (
    <LoaderContext.Provider value={data}>
      {children}
      {loader && <Loader />}
    </LoaderContext.Provider>
  );
};
