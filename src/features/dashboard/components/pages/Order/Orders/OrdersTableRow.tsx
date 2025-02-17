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
import { AuthContext } from "@/contexts/AuthContext.tsx";
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
  activeTab,
  setModals,
  render,
}: {
  setModals: Dispatch<
    SetStateAction<{
      view_invoice_pdf: number | null;
      view_instruction_pdf: number | null;
      order_reject_user: number | null;
    }>
  >;
  order: OrdersModel;
  activeTab: number;
  render: () => void;
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { auth } = useContext(AuthContext);
  const { setLoader } = useContext(LoaderContext);

  // Functions
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
  const getAccountantOrderPaymentConfirmation = async (orderId: number) => {
    setLoader(true);
    const { status, data } =
      await getAccountantOrderPaymentConfirmationRequest(orderId);
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

  const orderDetails = () => {
    return (
      <>
        <td>
          <span>{order.id}</span>
        </td>
        <td>{<span>{order.full_name}</span>}</td>
        <td>{<span>{order.phone}</span>}</td>
        <td>{<span>{order.email}</span>}</td>
        <td>
          <span>{order.start_location}</span>
        </td>
        <td>
          <span>{order.end_location}</span>
        </td>
        <td>
          <span>{dateStringConverter(order.created)}</span>
        </td>
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
      </>
    );
  };

  return (
    <tr>
      {/* Order Detail */}
      {orderDetails()}

      {/* Order Price */}
      {[
        "admin",
        "user",
        "directory",
        "commercial_directory",
        "commercial_manager",
        "accountant",
      ].includes(auth.role) && (
        <td>
          <span>$ {order.price || "0"}</span>
        </td>
      )}

      {[
        "admin",
        "user",
        "directory",
        "commercial_directory",
        "commercial_manager",
        "accountant",
      ].includes(auth.role) && (
        <td>
          <span>$ {order.balance || "0"}</span>
        </td>
      )}

      {/* Order Commercial Manager */}
      {["admin", "directory", "commercial_directory"].includes(auth.role) && (
        <td>
          <span>{order.commercial_manager || "---"}</span>
        </td>
      )}

      {/* Order Edit */}
      {["admin", "user", "commercial_manager", "buyer_manager"].includes(
        auth.role,
      ) &&
        activeTab === 2 && (
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
      {["user"].includes(auth.role) && activeTab === 1 && (
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

      {/* Accountant Order Payment Confirmation */}
      {["accountant"].includes(auth.role) && activeTab === 2 && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "approve",
                onClick: async () => {
                  await getAccountantOrderPaymentConfirmation(order.id);
                  render();
                },
              },
              {
                type: "reject",
                onClick: async () => {
                  await getAccountantOrderPaymentConfirmation(order.id);
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

      {/* Accountant Order Payment Confirmation */}
      {["user"].includes(auth.role) && activeTab === 0 && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "info",
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

      {/* Director Approve Order */}
      {["directory"].includes(auth.role) && activeTab === 2 && (
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
