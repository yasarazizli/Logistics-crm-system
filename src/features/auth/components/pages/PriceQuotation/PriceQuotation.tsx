import Register from "@/features/auth/components/pages/Register/Register.tsx";
import AuthLayout from "@/features/auth/components/layout/AuthLayout.tsx";
import { useContext, useState } from "react";
import { registerInputsRefModel } from "@/features/auth/models/auth.model.ts";

import styles from "./PriceQuotation.module.scss";

import Button from "@/components/Button/Button.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { postUnAuthorizedOrderRequest } from "@/features/auth/services/auth.service.ts";
import { formCreator } from "@/libs/form.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { defaultOrderValue } from "@/features/dashboard/constants/order.constant.tsx";
import { ArrowLeftIcon } from "@/assets/images/auth/auth.vector.tsx";
import { OrderModel } from "@/features/dashboard/models/order.model.ts";
import OrderDetail from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderDetail.tsx";

const PriceQuotation = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { setLoader } = useContext(LoaderContext);

  const [steps, setSteps] = useState<number>(0);
  const [order, setOrder] = useState<OrderModel>({ ...defaultOrderValue });

  const [user, setUser] = useState<{
    full_name: string;
    company_name: string;
    email: string;
    phone: string;
    password: string;
    identity_number: string;
    confirm_password: string;
  }>({
    full_name: "",
    company_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    identity_number: "",
  });

  const postUnAuthorizedOrder = async () => {
    setLoader(true);
    const formData = formCreator([
      {
        name: "order",
        data: JSON.stringify(order),
      },
      {
        name: "user",
        data: JSON.stringify(user),
      },
    ]);
    const { status } = await postUnAuthorizedOrderRequest(formData);
    if (status == 200) {
      navigate(`/${i18n.language}/auth/success`);
    }
    console.log(order);
    setLoader(false);
  };

  return (
    <div style={{ background: "black" }}>
      {steps === 0 && (
        <AuthLayout changeSide>
          <Register
            priceQuotation={(inputRefs: registerInputsRefModel) => {
              setUser({
                full_name: inputRefs.full_name.current?.value || "",
                company_name: inputRefs.company_name.current?.value || "",
                email: inputRefs.email.current?.value || "",
                phone: inputRefs.phone.current?.value || "",
                password: inputRefs.password.current?.value || "",
                confirm_password:
                  inputRefs.confirm__password.current?.value || "",
                identity_number: inputRefs.identity_number.current?.value || "",
              });
              setSteps(1);
            }}
          />
        </AuthLayout>
      )}

      {steps === 1 && (
        <main className={styles.price__quotation}>
          <h1 className={styles.price__quotation__title}>Quotation</h1>

          <p
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              setSteps(0);
            }}
          >
            <ArrowLeftIcon /> Geri
          </p>
          <OrderDetail order={order} setOrder={setOrder} />
          <Button text={"compilite order"} onClick={postUnAuthorizedOrder} />
        </main>
      )}
    </div>
  );
};

export default PriceQuotation;
