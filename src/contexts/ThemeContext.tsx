// React
import { createContext, useState, PropsWithChildren, useEffect } from "react";

export const ThemeContext = createContext<{
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  logo: string | null;
  setLogo: (value: string) => void;
}>({
  darkMode: false,
  setDarkMode: () => {},

  logo: "",
  setLogo: () => {},
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  // Function
  const storedDarkMode = localStorage.getItem("DarkModeLogistic");

  const [darkMode, setDarkMode] = useState<boolean>(storedDarkMode === "true");

  const [logo, setLogo] = useState<string>("");

  useEffect(() => {
    if (storedDarkMode !== null) setDarkMode(storedDarkMode === "true");
    else localStorage.setItem("DarkModeLogistic", JSON.stringify(darkMode));
  }, []);

  useEffect(() => {
    localStorage.setItem("DarkModeLogistic", JSON.stringify(darkMode));

    if (darkMode) document.getElementById("root")?.classList.add("dark");
    else document.getElementById("root")?.classList.remove("dark");
  }, [darkMode]);

  const data = {
    darkMode,
    setDarkMode,

    logo,
    setLogo,
  };

  return <ThemeContext.Provider value={data}>{children}</ThemeContext.Provider>;
};
