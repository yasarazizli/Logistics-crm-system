import React, { createContext, useEffect, useState } from "react";
import { checkRequest } from "../features/auth/services/auth.service.ts";
import { getCookie } from "@/libs/cookie.ts";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";

export const AuthContext = createContext<{
  auth: {
    isAuth: boolean | null;
    role: string;
    user: UserModel | null;
  };
  setAuth: React.Dispatch<
    React.SetStateAction<{
      isAuth: boolean | null;
      role: string;
      user: UserModel | null;
    }>
  >;
  check: () => void;
}>({
  auth: {
    isAuth: null,
    role: "",
    user: null,
  },
  setAuth: () => {},
  check: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<{
    isAuth: boolean | null;
    role: string;
    user: UserModel | null;
  }>({
    isAuth: null,
    role: "",
    user: null,
  });

  const check = async () => {
    const { status, data } = await checkRequest();

    console.log(data)

    if (getCookie("allianceToken") === "" || status !== 200) {
      setAuth({
        isAuth: false,
        role: "",
        user: null,
      });
    } else {
      setAuth({
        isAuth: true,
        role: data.role,
        user: data,
      });
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      await check();
    };
    checkUser().catch(() => {});
  }, []);

  const data = {
    auth,
    setAuth,
    check,
  };

  if (auth.isAuth !== null)
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
