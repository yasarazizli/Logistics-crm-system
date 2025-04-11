// React
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Context
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

// Types
import { OrdersModel } from "@/features/dashboard/models/order.model.ts";
import { TableResponseType } from "@/features/dashboard/models/shared.model.ts";

// Hooks
import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";

//Constants
import { getOrdersTable } from "@/features/dashboard/constants/tableHeader.constant.tsx";

// Request
import {
  getAllOrdersRequest,
  getUserOrderApprovedRequest,
} from "@/features/dashboard/services/order.service.ts";

// utils
import { orderFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import { errorMessageHandler } from "@/libs/error.ts";
import { toast } from "react-toastify";
import { Roles } from "@/features/dashboard/constants/enum.constant.tsx";

// Components
import PageHeader from "@/features/dashboard/components/shared/PageHeader/PageHeader.tsx";
import Table from "@/components/Table/Table.tsx";
import Filter from "@/components/Filter/Filter.tsx";
import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";
import InvoicePdf from "@/features/dashboard/components/shared/Modals/Order/InvoicePdf.tsx";
import InstructionPdf from "@/features/dashboard/components/shared/Modals/Order/InstructionPdf.tsx";
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import Button from "@/components/Button/Button.tsx";
import TextArea from "@/components/TextArea/TextArea.tsx";
import { formCreator } from "@/libs/form.ts";

// Styles
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import OrderPayment from "@/features/dashboard/components/shared/Modals/Order/OrderPayment.tsx";
import OrdersTableRow from "@/features/dashboard/components/pages/Orders/OrdersTableRow.tsx";

const Orders = () => {
  //  Reacts
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  // Contexts
  const { auth } = useContext(AuthContext);
  const { setLoader } = useContext(LoaderContext);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Hooks
  const { page } = usePageChanger();
  const { filterInputsData, setFilterInputsData, resetFilterInputs } =
    useFilterInputsChanger({ ...orderFilterConstants });

  // Response
  const [response, setResponse] = useState<TableResponseType>();
  const [pageHelper, setPageHelper] = useState({
    render: false,
    reRender: () => {
      setPageHelper((prevState) => ({
        ...prevState,
        render: !prevState.render,
      }));
    },
    tabs: [
      // User
      ...([Roles.user].includes(auth?.role as Roles)
        ? [
            {
              name: "order.tabs.list.one",
              tab: 0,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 0,
                  activeTabsName: "confirmed",
                }));
              },
            },
            {
              name: "order.tabs.list.two",
              tab: 1,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 1,
                  activeTabsName: "manager_confirmed",
                }));
              },
            },
            {
              name: "order.tabs.list.three",
              tab: 2,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 2,
                  activeTabsName: "processing",
                }));
              },
            },
          ]
        : []),

      // Accountant
      ...([Roles.accountant].includes(auth?.role as Roles)
        ? [
            {
              name: "order.tabs.list.four",
              tab: 3,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 3,
                  activeTabsName: "payment_pending",
                }));
              },
            },
            {
              name: "order.tabs.list.five",
              tab: 4,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 4,
                  activeTabsName: "shipping_started",
                }));
              },
            },
          ]
        : []),
    ],
    activeTab: auth.role === "user" ? 2 : auth.role === "accountant" ? 3 : 2,
    buttons: [
      {
        title: "order.buttons.create",
        onClick: () => {
          navigate(`/${i18n.language}/order/create`);
        },
      },
    ],
    activeTabsName: [Roles.accountant].includes(auth.role as Roles)
      ? "payment_pending"
      : "processing",
  });

  const getAllOrders = async () => {
    setLoader(true);
    const { status, data } = await getAllOrdersRequest(
      page,
      7,
      "",
      filterInputsData.name.value,
      filterInputsData.email.value,
      filterInputsData.phone.value,
      pageHelper.activeTabsName,
    );

    if (status === 200) {
      setResponse(data);
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  const postUserOrderApproved = async (orderId: number, isApprove: boolean) => {
    setLoader(true);
    const formData = formCreator([
      {
        name: "not",
        data: textareaRef.current?.value || "",
      },
    ]);
    const { data, status } = await getUserOrderApprovedRequest(
      orderId,
      isApprove,
      formData,
    );
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
    setLoader(false);
  };

  // Modals
  const [modals, setModals] = useState<{
    view_invoice_pdf: number | null;
    view_instruction_pdf: number | null;
    order_reject_user: number | null;
    order_payment: OrdersModel | null;
  }>({
    view_invoice_pdf: null,
    view_instruction_pdf: null,
    order_reject_user: null,
    order_payment: null,
  });

  // useEffects
  useEffect(() => {
    getAllOrders().catch(() => {});
  }, [page, pageHelper.render, pageHelper.activeTab]);

  return (
    <>
      <div className={styles.dashboard}>
        {[Roles.user].includes(auth.role as Roles) ? (
          <PageHeader title={`${auth.user?.full_name}`} />
        ) : (
          <PageTitle title={t("order.title")} />
        )}

        <Filter
          buttons={
            ([Roles.admin, Roles.user, Roles.commercial_manager].includes(
              auth.role as Roles,
            ) &&
              pageHelper.buttons) ||
            []
          }
          tabs={pageHelper.tabs}
          activeTabs={pageHelper.activeTab}
          onFilter={pageHelper.reRender}
          onClear={() => {
            pageHelper.reRender();
            resetFilterInputs();
          }}
        >
          <FilterPopup
            inputsState={filterInputsData}
            setInputsState={setFilterInputsData}
          />
        </Filter>

        <div className={styles.dashboard__table}>
          <Table
            dataCount={response?.page_count}
            tableRow={
              getOrdersTable(pageHelper.activeTab, i18n.language, auth.role)
                .header
            }
          >
            {response?.orders?.map((order: OrdersModel, index: number) => (
              <OrdersTableRow
                key={index}
                order={order}
                setModals={setModals}
                data={
                  getOrdersTable(pageHelper.activeTab, i18n.language, auth.role)
                    .rows
                }
                activeTab={pageHelper.activeTab}
                render={pageHelper.reRender}
              />
            ))}
          </Table>
        </div>
      </div>

      {modals.view_invoice_pdf && (
        <InvoicePdf
          id={modals.view_invoice_pdf}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              view_invoice_pdf: null,
            }));
          }}
        />
      )}

      {modals.order_reject_user && (
        <Modal
          title={"Reject Message"}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              order_reject_user: modals.order_reject_user,
            }));
          }}
        >
          <div className={styles.form__inputs}>
            <TextArea placeholder={"Qeyd"} inputRef={textareaRef} />
          </div>

          <div
            style={{ display: "flex", gap: "16px", marginTop: "16px" }}
            className={styles.form__buttons}
          >
            <Button
              text={t("shared.buttons.cancel")}
              viewType={"dark-green"}
              type={"button"}
              onClick={() => {
                setModals((prevState) => ({
                  ...prevState,
                  order_reject_user: null,
                }));
              }}
            />
            <Button
              onClick={async () => {
                await postUserOrderApproved(
                  modals?.order_reject_user || 0,
                  false,
                );
                setModals((prevState) => ({
                  ...prevState,
                  order_reject_user: null,
                }));
                setPageHelper((prevState) => ({
                  ...prevState,
                  render: !prevState.render,
                }));
              }}
              text={"Göndər"}
            />
          </div>
        </Modal>
      )}

      {modals.view_instruction_pdf && (
        <InstructionPdf
          id={modals.view_instruction_pdf}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              view_instruction_pdf: null,
            }));
          }}
        />
      )}

      {modals.order_payment && (
        <OrderPayment
          order={modals.order_payment}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              order_payment: null,
            }));
          }}
        />
      )}
    </>
  );
};

export default Orders;
