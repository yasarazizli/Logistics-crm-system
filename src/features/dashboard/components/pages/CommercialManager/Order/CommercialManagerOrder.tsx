import { useContext, useEffect, useState } from "react";
import styles from "../../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  PenIcon,
  SharedIcon,
  EyesIcon,
  AgreeIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import CreateStation from "@/features/dashboard/components/shared/Modals/Station/CreateStation.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import {
  getAllOrder,
  sendSpecialist,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import i18n from "@/locales/i18n.ts";
import { useNavigate } from "react-router-dom";
import SelectMember from "@/features/dashboard/components/shared/Modals/CommercialManager/SelectMember.tsx";
import { AddIconTable, CrossIcon } from "@/assets/icons/order.vectors.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import InvoicePdf from "@/features/dashboard/components/shared/Modals/InvoiceDocument/InvoicePdf.tsx";
import InvoiceApprove from "@/features/dashboard/components/shared/Modals/InvoiceDocument/InvoiceApprove/InvoiceApprove.tsx";
import InstructionPdf from "@/features/dashboard/components/shared/Modals/InvoiceDocument/InstructionDocument/InstructionPdf.tsx";
import SelectBank from "@/features/dashboard/components/shared/Modals/SelectBank/SelectBank.tsx"; // ✅ əlavə et

const filterKeys = [
  "order_code",
  "customer",
  "phone_number",
  "email",
  "country_loading",
  "country_destination",
  "start_date",
  "end_date",
  "status",
] as const;

interface Order {
  order_id: number;
  chose_member: string;
  country_destination: string;
  country_loading: string;
  customer: string;
  start_date: string;
  end_date: string;
  email: string;
  instructions: string;
  invoice: string;
  order_type: string;
  phone_number: string;
  status: string;
  select_bank?: string;
  bank?: string;
  price?: string | number;
}

const CommercialManager = () => {
  const navigate = useNavigate();
  const { setLoader } = useContext(LoaderContext);

  const [filters, setFilters] = useState({
    order_code: "",
    customer: "",
    phone_number: "",
    email: "",
    country_loading: "",
    country_destination: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const [modal, setModal] = useState<
    | null
    | "create"
    | "accountant"
    | "invoice"
    | "instruction"
    | { type: "invoice-approve"; id: number; actionType: "agree" | "reject" }
    | {
        type: "instruction-approve";
        id: number;
        actionType: "agree" | "reject";
      }
    | { type: "bank"; id: number }
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [data, setData] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    order_code: useDebounce(filters.order_code, 700),
    customer: useDebounce(filters.customer, 700),
    phone_number: useDebounce(filters.phone_number, 700),
    email: useDebounce(filters.email, 700),
    country_loading: useDebounce(filters.country_loading, 700),
    country_destination: useDebounce(filters.country_destination, 700),
    status: useDebounce(filters.status, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  const [pageHelper, setPageHelper] = useState({ render: false });

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllOrder({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        setData(response.data?.data || []);
        setTotal(response.data?.page_count || 0);
      }
    };
    fetchData();
    setLoader(false);
  }, [page, pageHelper.render, ...Object.values(debouncedFilters)]);

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

  const handleClickEdit = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/commercial/manager/information`, {
      state: { order: selectedOrder },
    });
  };

  const handleClickEdit_2 = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/commercial/manager/information/edit`, {
      state: { order: selectedOrder },
    });
  };

  const handleSendToSpecialist = async (orderId: number) => {
    setLoader(true);
    const response = await sendSpecialist(orderId);
    if (response?.status === 200) {
      toast.success(errorMessageHandler(response.data));
      setPageHelper((prev) => ({ ...prev, render: !prev.render }));
    } else {
      toast.error(errorMessageHandler(response.data));
    }
    setLoader(false);
  };

  const handleOpenInvoice = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModal("invoice");
  };

  const handleApproveInvoice = (orderId: number) => {
    setModal({ type: "invoice-approve", id: orderId, actionType: "agree" });
  };

  const handleOpenInstruction = (orderId: number) => {
    setSelectedOrderId(orderId);
    setModal("instruction");
  };

  const handleApproveInstruction = (orderId: number) => {
    setModal({ type: "instruction-approve", id: orderId, actionType: "agree" });
  };

  const handleSelectBank = (orderId: number) => {
    setModal({ type: "bank", id: orderId });
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Order</h1>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Order Code" },
            { name: "Customer" },
            { name: "Phone number" },
            { name: "Email address" },
            { name: "Country of loading" },
            { name: "Country of destination" },
            { name: "Start Date" },
            { name: "End Date" },
            { name: "Status" },
            { name: "Select Bank" },
            { name: "Invoice document" },
            { name: "Instruction document" },
            { name: "Choose member" },
            { name: "Send member" },
            { name: "Add Offer" },
            { name: "Edit" },
          ]}
          filters={
            <>
              {filterKeys.map((key) => (
                <td key={key}>
                  <input
                    type={key.includes("date") ? "date" : "text"}
                    placeholder={`Filter by ${key.replace("_", " ")}`}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                  />
                </td>
              ))}
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.order_id}>
              <td>{item.order_id}</td>
              <td>{item.customer}</td>
              <td>{item.phone_number}</td>
              <td>{item.email}</td>
              <td>{item.country_loading}</td>
              <td>{item.country_destination}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>{item.status}</td>

              <td>
                <div
                  className={styles.manager}
                  onClick={() => handleSelectBank(item.order_id)}
                  style={{ cursor: "pointer" }}
                >
                  {item.bank || "Select Bank"} <SharedIcon />
                </div>
              </td>

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

              <td>
                <div
                  className={styles.icon}
                  style={{ display: "flex", gap: "8px" }}
                >
                  <>
                    <div
                      className={styles.icon__3}
                      onClick={() => handleOpenInstruction(item.order_id)}
                      style={{ cursor: "pointer" }}
                      title="View Instruction PDF"
                    >
                      <EyesIcon />
                    </div>
                    <div
                      className={styles.icon__3}
                      onClick={() => handleApproveInstruction(item.order_id)}
                      style={{ cursor: "pointer" }}
                      title="Approve Instruction"
                    >
                      <AgreeIcon />
                    </div>
                  </>
                </div>
              </td>

              <td>
                <div
                  className={styles.manager}
                  onClick={() => {
                    setSelectedUserId(item.order_id);
                    setModal("accountant");
                  }}
                >
                  {item.chose_member || "Select Manager"} <SharedIcon />
                </div>
              </td>

              <td>
                <div
                  className={styles.shared}
                  onClick={() => handleSendToSpecialist(item.order_id)}
                  style={{ cursor: "pointer" }}
                >
                  Send
                </div>
              </td>

              <td>
                <div className={styles.icon}>
                  <div
                    className={`${styles.icon__2} ${
                      item.order_type === "RegisterPriceQuotation"
                        ? styles.disabled
                        : ""
                    }`}
                    onClick={() => {
                      if (item.order_type !== "RegisterPriceQuotation") {
                        handleClickEdit(item.order_id);
                      }
                    }}
                  >
                    {item.order_type === "RegisterPriceQuotation" ? (
                      <CrossIcon />
                    ) : (
                      <AddIconTable />
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() => handleClickEdit_2(item.order_id)}
                  >
                    <PenIcon />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pg) => setPage(pg)}
        />
      </div>

      {modal === "create" && (
        <CreateStation
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}

      {modal === "accountant" && selectedUserId && (
        <SelectMember
          modalClose={() => setModal(null)}
          id={selectedUserId}
          onSelect={(full_name) => {
            setData((prev) =>
              prev.map((item) =>
                item.order_id === selectedUserId
                  ? { ...item, chose_member: full_name }
                  : item,
              ),
            );
          }}
        />
      )}

      {modal === "invoice" && selectedOrderId && (
        <InvoicePdf
          id={selectedOrderId}
          modalClose={() => {
            setModal(null);
            setSelectedOrderId(null);
          }}
        />
      )}

      {modal === "instruction" && selectedOrderId && (
        <InstructionPdf
          id={selectedOrderId}
          modalClose={() => {
            setModal(null);
            setSelectedOrderId(null);
          }}
        />
      )}

      {modal && typeof modal === "object" && modal.type === "bank" && (
        <SelectBank
          id={modal.id}
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
          onSelect={(bankName: string) => {
            setData((prev) =>
              prev.map((item) =>
                item.order_id === modal.id
                  ? { ...item, select_bank: bankName }
                  : item,
              ),
            );
          }}
        />
      )}

      {modal &&
        typeof modal === "object" &&
        modal.type === "invoice-approve" && (
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

      {modal &&
        typeof modal === "object" &&
        modal.type === "instruction-approve" && (
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
    </div>
  );
};

export default CommercialManager;
