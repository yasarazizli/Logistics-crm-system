import Providers from "./router/Providers.tsx";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes.tsx";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Providers>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AppRoutes />
        <ToastContainer theme={"colored"} />
      </BrowserRouter>
    </Providers>
  );
}

export default App;
