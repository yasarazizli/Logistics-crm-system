import { useContext, useEffect, useRef, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  AgreeIcon,
  CycleIcon,
  EyesIcon,
  GreenAddIcon,
  PenIcon,
  PlusIcon,
  YellowPlusIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";
import { checkRequest } from "@/features/auth/services/auth.service.ts";
import AddBalance from "@/features/dashboard/components/shared/Modals/Users/AddBalance.tsx";
import AddContract from "@/features/dashboard/components/shared/Modals/Users/AddContract.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { useNavigate } from "react-router-dom";
import i18n from "@/locales/i18n.ts";
import { getAllOrder } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import InvoicePdf from "@/features/dashboard/components/shared/Modals/InvoiceDocument/InvoicePdf.tsx";
import InvoiceApprove from "@/features/dashboard/components/shared/Modals/InvoiceDocument/InvoiceApprove/InvoiceApprove.tsx";
import ReOrder from "@/features/dashboard/components/shared/Modals/ReOrder/ReOrder.tsx";
import { CrossIcon } from "@/assets/icons/order.vectors.tsx";

const filterKeys = [
  "order_code",
  "country_loading",
  "country_destination",
  "start_date",
  "end_date",
] as const;

interface Order {
  order_id: number;
  country_destination: string;
  country_loading: string;
  start_date: string;
  end_date: string;
  status: string;
  order_type: string;
}

const Users = () => {
  const navigate = useNavigate();
  const dataRef = useRef<any>(null);
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    order_code: "",
    country_loading: "",
    country_destination: "",
    start_date: "",
    end_date: "",
    status: "pending",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "add" }
    | { type: "contract"; id: number }
    | { type: "invoice"; id: number }
    | { type: "invoice-approve"; id: number; actionType: "agree" | "reject" }
    | { type: "reorder"; id: number; actionType: "agree" | "reject" }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [data, setData] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);

  const debouncedFilters = {
    order_code: useDebounce(filters.order_code, 700),
    country_loading: useDebounce(filters.country_loading, 700),
    country_destination: useDebounce(filters.country_destination, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllOrder({
        ...debouncedFilters,
        status: filters.status,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        setData(response.data?.data || []);
        setTotal(response.data?.count || 0);
      }
    };
    fetchData();
    setLoader(false);
  }, [
    page,
    pageHelper.render,
    filters.status,
    ...Object.values(debouncedFilters),
  ]);

  useEffect(() => {
    setLoader(true);
    const checkData = async () => {
      const response = await checkRequest();
      if (response?.status === 200) {
        dataRef.current = response.data;
      }
    };
    checkData();
    setLoader(false);
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  const status = [
    "pending",
    "offered",
    "ordered",
    "shipped",
    "draft",
    "rejected",
  ];

  const statusColors: Record<string, string> = {
    pending: "#F5E233",
    offered: "#F5E233",
    ordered: "#1D7321",
    shipped: "#1D7321",
    draft: "#808080",
    rejected: "#F74156",
  };

  const goToQuotation = () => {
    navigate(`/${i18n.language}/users/ask/order`, {
      state: { showShipper: true },
    });
  };

  const goToAskQuotation = () => {
    navigate(`/${i18n.language}/users/ask/quotation`, {});
  };

  const handleClickEdit = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/user/offer/confirmation`, {
      state: { order: selectedOrder },
    });
  };

  const canEditOrder = (orderType: string) => {
    return (
      orderType === "NoRegisterPriceQuotation" ||
      orderType === "RegisterPriceQuotation"
    );
  };

  const handleEditClick = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/users/ask/quotation/edit`, {
      state: { order: selectedOrder },
    });
  };

  const handleQuotationEdit = (orderId: number) => {
    if (!canEditOrder) return;

    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/users/ask/quotation/update`, {
      state: { order: selectedOrder },
    });
  };

  const handleOpenInvoice = (orderId: number) => {
    setModal({ type: "invoice", id: orderId });
  };

  const handleApproveInvoice = (orderId: number) => {
    setModal({ type: "invoice-approve", id: orderId, actionType: "agree" });
  };

  const handleReOrder = (orderId: number) => {
    setModal({ type: "reorder", id: orderId, actionType: "agree" });
  };

  const getHeaders = () => {
    const baseHeaders = [
      { name: "Order code", key: "order_code" },
      { name: "Country of loading", key: "country_loading" },
      { name: "Country of destination", key: "country_destination" },
      { name: "Start Date", key: "start_date" },
      { name: "End Date", key: "end_date" },
      { name: "Status", key: "status" },
    ];

    if (filters.status === "ordered") {
      baseHeaders.push({ name: "Invoice document", key: "invoice_document" });
    }

    if (filters.status === "offered") {
      baseHeaders.push({ name: "User confirmation", key: "user_confirmation" });
    }

    if (filters.status === "shipped") {
      baseHeaders.push({ name: "Clone Order", key: "clone_order" });
    }

    if (filters.status === "draft") {
      baseHeaders.push({ name: "Edit Order", key: "edit_order" });
      baseHeaders.push({ name: "Edit Quotation", key: "edit_quotation" });
    }

    return baseHeaders;
  };

  const headers = getHeaders();

  const getFilterCells = () => {
    const baseFilterCells = filterKeys.map((key) => (
      <td key={key}>
        <input
          type={key.includes("date") ? "date" : "text"}
          placeholder={`Filter by ${key.replace(/_/g, " ")}`}
          value={filters[key]}
          onChange={(e) => handleFilterChange(e, key)}
        />
      </td>
    ));

    baseFilterCells.push(<td key="status"></td>);

    if (filters.status === "ordered") {
      baseFilterCells.push(<td key="invoice_document"></td>);
    }

    if (filters.status === "offered") {
      baseFilterCells.push(<td key="user_confirmation"></td>);
    }

    if (filters.status === "shipped") {
      baseFilterCells.push(<td key="clone_order"></td>);
    }

    if (filters.status === "draft") {
      baseFilterCells.push(<td key="edit_order"></td>);
      baseFilterCells.push(<td key="edit_quotation"></td>);
    }

    return baseFilterCells;
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Clients</h1>
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          {status.map((stat) => (
            <button
              key={stat}
              onClick={() => {
                setFilters((prev) => ({ ...prev, status: stat }));
                setPage(1);
              }}
              className={`${styles.statusButton} ${
                filters.status === stat ? styles.activeStatus : ""
              }`}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  backgroundColor: statusColors[stat],
                }}
              />
              {t(`workers.status.${stat}`)}
            </button>
          ))}
        </div>

        <div className={styles.btn}>
          <div
            className={styles.status}
            onClick={() =>
              setModal({ type: "contract", id: dataRef.current?.id })
            }
          >
            <p>
              {t("workers.status.contract")}
              {dataRef.current?.contract_status}
              <GreenAddIcon />
            </p>
          </div>
          <div
            className={styles.price}
            onClick={() => setModal({ type: "add" })}
          >
            <YellowPlusIcon />
            <p>
              {t("workers.status.price")}
              {dataRef.current?.balance} AZN
            </p>
          </div>
          <Button
            text="Create Order"
            icon={PlusIcon}
            viewType="green__light"
            onClick={goToQuotation}
          />
          <Button
            text="Ask Quotation"
            viewType="green__light"
            onClick={goToAskQuotation}
          />
        </div>
      </div>

      <div className={styles.table}>
        <Table headers={headers} filters={<>{getFilterCells()}</>}>
          {data.map((item) => (
            <tr key={item.order_id}>
              <td>{item.order_id}</td>
              <td>{item.country_loading}</td>
              <td>{item.country_destination}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>{item.status}</td>

              {filters.status === "ordered" && (
                <td>
                  <div
                    className={styles.icon}
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <div
                      className={styles.icon__3}
                      onClick={() => handleOpenInvoice(item.order_id)}
                      style={{ cursor: "pointer" }}
                      title="View Invoice PDF"
                    >
                      <EyesIcon />
                    </div>
                    <div
                      className={styles.icon__3}
                      onClick={() => handleApproveInvoice(item.order_id)}
                      style={{ cursor: "pointer" }}
                      title="Approve Invoice"
                    >
                      <AgreeIcon />
                    </div>
                  </div>
                </td>
              )}

              {filters.status === "offered" && (
                <td>
                  <div className={styles.icon}>
                    <div
                      className={styles.icon__3}
                      onClick={() => handleClickEdit(item.order_id)}
                      title="User Confirmation"
                    >
                      <AgreeIcon />
                    </div>
                  </div>
                </td>
              )}

              {filters.status === "shipped" && (
                <td>
                  <div className={styles.icon}>
                    <div
                      className={styles.icon__4}
                      onClick={() => handleReOrder(item.order_id)}
                      style={{ cursor: "pointer" }}
                      title="ReOrder"
                    >
                      <CycleIcon />
                    </div>
                  </div>
                </td>
              )}

              {filters.status === "draft" && (
                <td>
                  <div className={styles.icon}>
                    <div
                      className={styles.icon__2}
                      onClick={() => handleEditClick(item.order_id)}
                      title="Edit Quotadtion"
                    >
                      <PenIcon />
                    </div>
                  </div>
                </td>
              )}

              {filters.status === "draft" && (
                <td>
                  <div className={styles.icon}>
                    <div
                      className={`${styles.icon__2} ${
                        !canEditOrder(item.order_type) ? styles.disabled : ""
                      }`}
                      onClick={() => {
                        if (canEditOrder(item.order_type)) {
                          handleQuotationEdit(item.order_id);
                        }
                      }}
                      style={{
                        cursor: canEditOrder(item.order_type)
                          ? "pointer"
                          : "not-allowed",
                        opacity: canEditOrder(item.order_type) ? 1 : 1,
                      }}
                      title={
                        canEditOrder(item.order_type)
                          ? "Edit Order"
                          : "Edit Order not available for this order type"
                      }
                    >
                      {canEditOrder(item.order_type) ? (
                        <PenIcon />
                      ) : (
                        <CrossIcon />
                      )}
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pg) => setPage(pg)}
        />
      </div>

      {modal?.type === "add" && (
        <AddBalance
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}

      {modal?.type === "contract" && (
        <AddContract
          id={modal.id}
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}

      {modal?.type === "invoice" && (
        <InvoicePdf
          id={modal.id}
          modalClose={() => {
            setModal(null);
          }}
        />
      )}

      {modal?.type === "invoice-approve" && (
        <InvoiceApprove
          id={modal.id}
          actionType={modal.actionType}
          modalClose={(isRender: boolean) => {
            setModal(null);
            if (isRender) {
              setPageHelper((prev) => ({ ...prev, render: !prev.render }));
            }
          }}
        />
      )}

      {modal?.type === "reorder" && (
        <ReOrder
          id={modal.id}
          actionType={modal.actionType}
          modalClose={(isRender: boolean) => {
            setModal(null);
            if (isRender) {
              setPageHelper((prev) => ({ ...prev, render: !prev.render }));
            }
          }}
        />
      )}
    </div>
  );
};

export default Users;
