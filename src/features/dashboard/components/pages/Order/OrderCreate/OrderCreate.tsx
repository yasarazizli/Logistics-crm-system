import styles from "./OrderCreate.module.scss";
import Tabs from "@/components/Tabs/Tabs.tsx";
import { useContext, useEffect, useState } from "react";
import Button from "@/components/Button/Button.tsx";
import { DeleteOrderIcon } from "@/assets/images/layout/dashboard.vector.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import {
  getByIdOrderRequest,
  postBuyerAddPadCodeRequest,
  postInstructionDocumentRequest,
  postOrderCreateRequest,
  postOrderUpdateRequest,
  postSalesManagerApprovalRequest,
  postSendOrderRequest,
} from "@/features/dashboard/services/order.service.ts";
import {
  OrderModel,
  RouteModel,
} from "@/features/dashboard/models/order.model.ts";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { defaultOrderValue } from "@/features/dashboard/constants/order.constant.tsx";
import { useTranslation } from "react-i18next";
import ServiceEditor from "@/features/dashboard/components/pages/Order/OrderCreate/ServiceEditor/ServiceEditor.tsx";
import RouteEditor from "@/features/dashboard/components/pages/Order/OrderCreate/RouteEditor/RouteEditor.tsx";
import ClientEditor from "@/features/dashboard/components/pages/Order/OrderCreate/ClientEditor/ClientEditor.tsx";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";
import { errorMessageHandler } from "@/libs/error.ts";
import {
  ConfirmTableIcon,
  SaveOrderIcon,
  SubmitOrderIcon,
} from "@/assets/icons/order.vectors.tsx";

const OrderCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { darkMode } = useContext(ThemeContext);

  const { setLoader } = useContext(LoaderContext);
  const { auth } = useContext(AuthContext);

  const [tab, setTab] = useState(0);
  const [order, setOrder] = useState<OrderModel>({ ...defaultOrderValue });

  // Constants
  const OrderTabs = [
    {
      name: "order.tabs.create.one",
      tabs: 0,
      onClick: () => setTab(0),
    },
    {
      name: "order.tabs.create.two",
      tabs: 1,
      onClick: () => setTab(1),
    },
  ];

  // Edit
  const getEditOrder = async () => {
    setLoader(true);
    const { status, data } = await getByIdOrderRequest(
      Number(location.search.replace("?", "")),
    );
    if (status === 200) {
      setOrder({
        orderDetail: {
          routes: data.routes.sort(
            (a: RouteModel, b: RouteModel) => a.priority - b.priority,
          ),
          services: data.services,
        },
        id: data.order.id,
        user: data.order.user,
        user_id: data.order.user_id,
        start_time: data.order.start_time,
        end_time: data.order.end_time,
        expeditor: data.order.expeditor,
        seller_id: data.order.seller_id,
        shipper: data.order.shipper,
        receiver: data.order.receiver,
        note: data.order.note,
        status: data.order.status,
        deleted: {
          routes: [],
          packings: [],
          packing_hs_code: [],
          services: [],
        },
      });
    }
    setLoader(false);
  };

  // Create & Update Order
  const postOrder = async (id: number | null, isSend: boolean) => {
    if (order.user?.id === undefined && auth.role !== "user") {
      toast.error("Istifatəçi seçin");
      return;
    }

    setLoader(true);
    const formData = formCreator([
      {
        name: "data",
        data: JSON.stringify(order?.orderDetail),
      },
      {
        name: "expeditor",
        data: order?.expeditor || "",
      },
      {
        name: "seller_id",
        data: order?.seller_id || "",
      },
      {
        name: "user_id",
        data: order?.user_id || "",
      },
      {
        name: "start_time",
        data: order?.start_time || "",
      },
      {
        name: "end_time",
        data: order?.end_time || "",
      },
      {
        name: "shipper",
        data: order?.shipper || "",
      },
      {
        name: "receiver",
        data: order?.receiver || "",
      },
      {
        name: "note",
        data: order?.note || "",
      },
      {
        name: "deleted",
        data: JSON.stringify(order?.deleted),
      },
    ]);

    let response;

    if (id === null) {
      const { status, data } = await postOrderCreateRequest(formData);
      if (status === 200) {
        toast.success(errorMessageHandler(data));
        navigate(`/${i18n.language}/order`);
      } else toast.error(errorMessageHandler(data));
    } else {
      response = await postOrderUpdateRequest(id, formData);
      if (isSend) {
        if (response.status === 200) {
          const { status, data } = await postSendOrderRequest(id);
          if (status === 200) {
            toast.success(errorMessageHandler(data));
            navigate(`/${i18n.language}/order`);
          } else toast.error(errorMessageHandler(data));
        }
      } else {
        if (response.status === 200) {
          toast.success(errorMessageHandler(response.data));
          navigate(`/${i18n.language}/order`);
        } else toast.error(errorMessageHandler(response.data));
      }
    }

    setLoader(false);
  };

  // post Buyers
  const postInstructionDocument = async () => {
    setLoader(true);
    const formData = formCreator([
      {
        name: "data",
        data: JSON.stringify(order?.orderDetail),
      },
    ]);

    const { status, data } = await postInstructionDocumentRequest(
      formData,
      Number(order.id),
    );
    if (status === 200) {
      toast.success(errorMessageHandler(data));
      navigate(`/${i18n.language}/order`);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  // post CommercialManager Manager
  const postCommercialManagerApproval = async () => {
    setLoader(true);
    const formData = formCreator([
      {
        name: "receiver",
        data: order.receiver || "",
      },
      {
        name: "shipper",
        data: order.shipper || "",
      },
      {
        name: "expeditor",
        data: order.expeditor || "",
      },
    ]);

    const { status, data } = await postSalesManagerApprovalRequest(
      formData,
      Number(order.id),
    );
    if (status === 200) {
      toast.success(errorMessageHandler(data));
      navigate(`/${i18n.language}/order`);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  // post Buyer Pad code
  const postBuyerAddPadCode = async () => {
    setLoader(true);
    const formData = formCreator([
      {
        name: "data",
        data: JSON.stringify(order?.orderDetail),
      },
    ]);

    const { status, data } = await postBuyerAddPadCodeRequest(
      formData,
      Number(order.id),
    );
    if (status === 200) {
      toast.success(errorMessageHandler(data));
      navigate(`/${i18n.language}/order`);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  useEffect(() => {
    if (location.pathname.includes("update")) {
      getEditOrder().catch(() => {});
    }

    if (auth.role === "user") {
      setOrder((prevState) => ({
        ...prevState,
        user: auth.user,
        user_id: Number(auth.user?.id),
      }));
    }
  }, []);

  return (
    <>
      <div
        className={`${styles.order} ${["user"].includes(auth.role) && styles.user} ${darkMode && styles.dark}`}
      >
        <div className={`${styles.order__box} ${tab === 1 && styles.active}`}>
          <Tabs tabs={OrderTabs} active={tab} />

          <div
            className={`${styles.buttons} ${["user"].includes(auth.role) && styles.two__buttons}`}
          >
            {["admin", "commercial_manager"].includes(auth.role) &&
              order.status === "SalesAddCodeIsExpected" && (
                <Button
                  icon={ConfirmTableIcon}
                  text={t("order.buttons.send_instruction_document")}
                  viewType={"dark-green"}
                  onClick={async () => {
                    await postInstructionDocument();
                  }}
                />
              )}

            {["buyer_manager"].includes(auth.role) &&
              order.status === "PadCodeIsExpected" && (
                <Button
                  icon={ConfirmTableIcon}
                  text={t("order.buttons.confirm")}
                  viewType={"dark-green"}
                  onClick={async () => {
                    await postBuyerAddPadCode();
                  }}
                />
              )}

            {["commercial_manager"].includes(auth.role) &&
              order.status === "AwaitingSalesManagerApproval" && (
                <Button
                  icon={ConfirmTableIcon}
                  text={t("order.buttons.confirm")}
                  viewType={"dark-green"}
                  onClick={async () => {
                    await postCommercialManagerApproval();
                  }}
                />
              )}

            {["user", "admin", "commercial_manager", "buyer_manager"].includes(
              auth.role,
            ) && (
              <Button
                icon={SaveOrderIcon}
                text={t("order.buttons.save")}
                onClick={async () => {
                  await postOrder(order.id || null, false);
                }}
              />
            )}

            {["admin", "commercial_manager"].includes(auth.role) &&
              order.status === "Processing" && (
                <Button
                  icon={SubmitOrderIcon}
                  text={t("order.buttons.send")}
                  viewType={"dark-green"}
                  onClick={async () => {
                    await postOrder(order.id || null, true);
                  }}
                />
              )}

            <Button
              icon={DeleteOrderIcon}
              text={t("order.buttons.back")}
              viewType={"red"}
              onClick={() => {
                console.log(order);
              }}
            />
          </div>

          <div className={styles.main__informations}>
            {tab === 0 && <ClientEditor order={order} setOrder={setOrder} />}
            {tab === 1 && <RouteEditor order={order} setOrder={setOrder} />}
          </div>
        </div>

        {auth.role !== "user" && (
          <ServiceEditor order={order} setOrder={setOrder} active={tab === 0} />
        )}
      </div>
    </>
  );
};

export default OrderCreate;
