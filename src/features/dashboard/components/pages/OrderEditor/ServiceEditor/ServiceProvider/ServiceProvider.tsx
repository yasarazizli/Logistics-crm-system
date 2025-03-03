import { useContext, useEffect, useState } from "react";

import { OrderEditorProps } from "@/features/dashboard/models/order.model.ts";

import { defaultServiceValue } from "@/features/dashboard/constants/order.constant.tsx";

import Button from "@/components/Button/Button.tsx";

import { generate8CharID } from "@/libs/form.ts";

import styles from "./ServiceProvider.module.scss";
import { AddIcon } from "@/assets/icons/order.vectors.tsx";
import { StoreContext } from "@/contexts/StoreContext.tsx";
import { useTranslation } from "react-i18next";
import OrderServiceTable
    from "@/features/dashboard/components/pages/OrderEditor/ServiceEditor/OrderServiceTable/OrderServiceTable.tsx";

const ServiceProvider = ({ order, setOrder }: OrderEditorProps) => {
  const { t } = useTranslation();
  const { getData } = useContext(StoreContext);
  const [edit, setEdit] = useState<number | null>(null);

  useEffect(() => {
    getData(["services"]).catch(() => {});
  }, []);

  return (
    <div className={`${styles.service__provider}`}>
      <div className={styles.provider__head}>
        <Button
          icon={AddIcon}
          text={t("order.services.provider.buttons.add_service")}
          viewType={"dark-green"}
          onClick={() => {
            setOrder((prevState) => {
              return {
                ...prevState,
                orderDetail: {
                  ...prevState.orderDetail,
                  services: [
                    ...(prevState.orderDetail.services || []),
                    {
                      ...defaultServiceValue,
                      key_id: generate8CharID(),
                    },
                  ],
                },
              };
            });


            setEdit(Number(order.orderDetail.services?.length));
          }}
        />
      </div>

      <OrderServiceTable
        edit={edit}
        setEdit={setEdit}
        order={order}
        setOrder={setOrder}
      />
    </div>
  );
};

export default ServiceProvider;
