import { dateStringConverter } from "@/libs/date.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CorrectIcon,
  ProcessIcon,
  RejectIcon,
} from "@/assets/images/layout/dashboard.vector.tsx";
import Tools from "@/components/Tools/Tools.tsx";
import { Dispatch, SetStateAction, useContext } from "react";
import { OrdersModel } from "@/features/dashboard/models/order.model.ts";
import {
  getAccountantOrderPaymentConfirmationRequest,
  getDirectoryApproveOrderRequest,
  getUserOrderApprovedRequest,
} from "@/features/dashboard/services/order.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

const OrdersTableRow = ({
  order,
  setModals,
  render,
  data,
}: {
  setModals: Dispatch<
    SetStateAction<{
      view_invoice_pdf: number | null;
      view_instruction_pdf: number | null;
      order_reject_user: number | null;
      order_payment: OrdersModel | null;
    }>
  >;
  order: OrdersModel;
  activeTab: number;
  render: () => void;
  data: number[];
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  //  User Order Approved
  const postUserOrderApproved = async (orderId: number, isApprove: boolean) => {
    setLoader(true);
    const { data, status } = await getUserOrderApprovedRequest(
      orderId,
      isApprove,
    );
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  // Accountant Order Payment Confirmation
  const getAccountantOrderPaymentConfirmation = async (
    orderId: number,
    is_approve: boolean,
  ) => {
    setLoader(true);
    const { status, data } = await getAccountantOrderPaymentConfirmationRequest(
      orderId,
      is_approve,
    );
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  const getDirectoryApproveOrder = async (
    orderId: number,
    approve_status: boolean,
  ) => {
    setLoader(true);
    const { status, data } = await getDirectoryApproveOrderRequest(
      orderId,
      approve_status,
    );
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  // Renders
  const renderStatus = (status: string) => {
    const statusMap = {
      Processing: { icon: <ProcessIcon />, color: "#FFA800" },
      ManagerConfirmed: { icon: <ProcessIcon />, color: "#FFA800" },
      PaymentPending: { icon: <ProcessIcon />, color: "#FFA800" },
      ShippingStarted: { icon: <CorrectIcon />, color: "#436BFD" },
      PadCodeIsExpected: { icon: <ProcessIcon />, color: "#FFA800" },
      AwaitingDirectoryApproval: { icon: <ProcessIcon />, color: "#FFA800" },
      SalesAddCodeIsExpected: { icon: <ProcessIcon />, color: "#FFA800" },
      AwaitingSalesManagerApproval: { icon: <ProcessIcon />, color: "#FFA800" },
      Correct: { icon: <CorrectIcon />, color: "#436BFD" },
      DirectoryDeclined: { icon: <RejectIcon />, color: "#FF4D4F" },
      UserDeclined: { icon: <RejectIcon />, color: "#FF4D4F" },
    };

    const currentStatus = statusMap[status as keyof typeof statusMap] || {
      icon: null,
      color: "#000",
    };

    return (
      <span style={{ color: currentStatus.color, display: "flex", gap: "4px" }}>
        {currentStatus.icon} {status || ""}
      </span>
    );
  };

  return (
    <tr>
      {/* Id */}
      {data.includes(0) && (
        <td>
          <span>{order.id}</span>
        </td>
      )}

      {/* Full name */}
      {data.includes(1) && <td>{<span>{order.full_name}</span>}</td>}

      {/* Phone */}
      {data.includes(2) && <td>{<span>{order.phone}</span>}</td>}

      {/* Email */}
      {data.includes(3) && <td>{<span>{order.email}</span>}</td>}

      {/* Start location */}
      {data.includes(4) && (
        <td>
          <span>{order.start_location}</span>
        </td>
      )}

      {/* End location */}
      {data.includes(5) && (
        <td>
          <span>{order.end_location}</span>
        </td>
      )}

      {/* Created */}
      {data.includes(6) && (
        <td>
          <span>{dateStringConverter(order.created)}</span>
        </td>
      )}

      {/* Status */}
      {data.includes(7) && (
        <td>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {renderStatus(order.status)}
          </span>
        </td>
      )}

      {/* Price */}
      {data.includes(8) && (
        <td>
          <span>$ {order.price || "0"}</span>
        </td>
      )}

      {/* Balance */}
      {data.includes(9) && (
        <td>
          <span>$ {order.balance || "0"}</span>
        </td>
      )}

      {/* Credit limit */}
      {data.includes(10) && (
        <td>
          <span>$ {order.credit_limit || "0"}</span>
        </td>
      )}

      {/* Out Standing Amount */}
      {data.includes(11) && (
        <td>
          <span>$ {order.out_standing_amount || "0"}</span>
        </td>
      )}

      {/* Last Payment Date */}
      {data.includes(12) && (
        <td>
          <span>{dateStringConverter(order.last_payment_date)}</span>
        </td>
      )}

      {/* Commercial Manager */}
      {data.includes(13) && (
        <td>
          <span>{order.commercial_manager || "---"}</span>
        </td>
      )}

      {/* User Instuction Document */}
      {data.includes(15) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "",
                text: "view instruction pdf",
                onClick: async () =>
                  setModals((prevState) => ({
                    ...prevState,
                    view_instruction_pdf: order.id,
                  })),
              },
            ]}
          />
        </td>
      )}

      {/* Order Edit */}
      {data.includes(16) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "edit",
                onClick: () => {
                  navigate(`/${i18n.language}/order/update?${order.id}`);
                },
              },
            ]}
          />
        </td>
      )}

      {/* User Approve Order */}
      {data.includes(17) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "approve",
                onClick: async () => {
                  await postUserOrderApproved(order.id, true);
                  render();
                },
              },
              {
                type: "reject",
                onClick: async () => {
                  setModals((prevState) => ({
                    ...prevState,
                    order_reject_user: order.id,
                  }));
                },
              },
            ]}
          />
        </td>
      )}

      {/* Order Payment */}
      {data.includes(18) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "add",
                text: "Odenish",
                onClick: () => {
                  setModals((prevState) => ({
                    ...prevState,
                    order_payment: order,
                  }));
                },
              },
            ]}
          />
        </td>
      )}

      {/* Accountant Order Payment Confirmation */}
      {data.includes(19) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "approve",
                onClick: async () => {
                  await getAccountantOrderPaymentConfirmation(order.id, true);
                  render();
                },
              },
              {
                type: "reject",
                onClick: async () => {
                  await getAccountantOrderPaymentConfirmation(order.id, false);
                  render();
                },
              },
              {
                type: "info",
                onClick: async () =>
                  setModals((prevState) => ({
                    ...prevState,
                    view_invoice_pdf: order.id,
                  })),
              },
            ]}
          />
        </td>
      )}

      {/* Director Approve Order */}
      {data.includes(20) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "approve",
                onClick: async () => {
                  await getDirectoryApproveOrder(order.id, true);
                  render();
                },
              },
              {
                type: "reject",
                onClick: async () => {
                  await getDirectoryApproveOrder(order.id, false);
                  render();
                },
              },
            ]}
          />
        </td>
      )}
    </tr>
  );
};

export default OrdersTableRow;
