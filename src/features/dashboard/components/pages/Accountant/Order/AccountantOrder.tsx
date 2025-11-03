import { useContext, useEffect, useState } from "react";
import styles from "../../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { PenIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import {
  DebtOrder,
  FullOrder,
} from "@/features/dashboard/services/Accountant/accountant.service.ts";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import Tabs from "@/components/Tabs/Tabs.tsx";
import { AddIconTable, CrossIcon } from "@/assets/icons/order.vectors.tsx";
import AgreeOrder from "@/features/dashboard/components/shared/Modals/Accountant/AgreeOrder.tsx";
import AddPayment from "@/features/dashboard/components/shared/Modals/Accountant/AddPayment.tsx"; // ƏLAVƏ EDİN

const AccountantOrder = () => {
  const { setLoader } = useContext(LoaderContext);
  const [activeTab, setActiveTab] = useState<number>(0);

  const tabs = [
    { name: "Order", tab: 0, onClick: () => setActiveTab(0) },
    { name: "Order Confirmation", tab: 1, onClick: () => setActiveTab(1) },
  ];

  const [filters, setFilters] = useState({
    order_code: "",
    customer: "",
    phone_number: "",
    email: "",
    country_loading: "",
    country_destination: "",
    start_date: "",
    end_date: "",
  });

  const [modal, setModal] = useState<null | {
    type: "agree" | "reject" | "payment";
    order_id: number;
  }>(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    order_code: useDebounce(filters.order_code, 700),
    customer: useDebounce(filters.customer, 700),
    phone_number: useDebounce(filters.phone_number, 700),
    email: useDebounce(filters.email, 700),
    country_loading: useDebounce(filters.country_loading, 700),
    country_destination: useDebounce(filters.country_destination, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      let response;

      if (activeTab === 0) {
        response = await FullOrder({
          page,
          pageSize,
          order_code: debouncedFilters.order_code,
          customer: debouncedFilters.customer,
          phone_number: debouncedFilters.phone_number,
          email: debouncedFilters.email,
          country_loading: debouncedFilters.country_loading,
          country_destination: debouncedFilters.country_destination,
          start_date: debouncedFilters.start_date,
          end_date: debouncedFilters.end_date,
          payment_status: "full",
        });
      } else {
        response = await DebtOrder({
          page,
          pageSize,
          order_code: debouncedFilters.order_code,
          customer: debouncedFilters.customer,
          phone_number: debouncedFilters.phone_number,
          email: debouncedFilters.email,
          country_loading: debouncedFilters.country_loading,
          country_destination: debouncedFilters.country_destination,
          start_date: debouncedFilters.start_date,
          end_date: debouncedFilters.end_date,
          payment_status: "debt",
        });
      }

      if (response?.status === 200) {
        console.log("data", response.data);
        setData(response.data?.data || []);
        setTotal(response.data?.page_count || 0);
      }
    };
    fetchData();
    setLoader(false);
  }, [page, pageHelper.render, ...Object.values(debouncedFilters), activeTab]);

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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  const getTableHeaders = () => {
    const baseHeaders = [
      { name: "Order Code" },
      { name: "Customer" },
      { name: "E-mail address" },
      { name: "Phone number" },
    ];

    if (activeTab === 0) {
      return [
        ...baseHeaders,
        { name: "Country of loading" },
        { name: "Country of destination" },
        { name: "Date" },
        { name: "Status" },
        { name: "Price" },
        { name: "Edit" },
      ];
    } else {
      return [
        ...baseHeaders,
        { name: "Date" },
        { name: "Status" },
        { name: "Price" },
        { name: "Balance" },
        { name: "Credit limit" },
        { name: "Debt" },
        { name: "Final Payment date" },
        { name: "Payment" },
      ];
    }
  };

  const getFilterColumns = () => {
    const baseFilters = [
      <td key="order_code">
        <input
          placeholder="Order Code"
          value={filters.order_code}
          onChange={(e) => handleFilterChange(e, "order_code")}
        />
      </td>,
      <td key="customer">
        <input
          placeholder="Customer"
          value={filters.customer}
          onChange={(e) => handleFilterChange(e, "customer")}
        />
      </td>,
      <td key="email">
        <input
          placeholder="Email"
          value={filters.email}
          onChange={(e) => handleFilterChange(e, "email")}
        />
      </td>,
      <td key="phone_number">
        <input
          placeholder="Phone"
          value={filters.phone_number}
          onChange={(e) => handleFilterChange(e, "phone_number")}
        />
      </td>,
    ];

    if (activeTab === 0) {
      return [
        ...baseFilters,
        <td key="country_loading">
          <input
            placeholder="Loading Country"
            value={filters.country_loading}
            onChange={(e) => handleFilterChange(e, "country_loading")}
          />
        </td>,
        <td key="country_destination">
          <input
            placeholder="Destination Country"
            value={filters.country_destination}
            onChange={(e) => handleFilterChange(e, "country_destination")}
          />
        </td>,
        <td key="date_empty"></td>,
        <td key="status_empty"></td>,
        <td key="price_empty"></td>,
        <td key="edit_empty"></td>,
      ];
    } else {
      return [
        ...baseFilters,
        <td key="date_empty"></td>,
        <td key="status_empty"></td>,
        <td key="price_empty"></td>,
        <td key="balance_empty"></td>,
        <td key="credit_limit_empty"></td>,
        <td key="debt_empty"></td>,
        <td key="final_payment_empty"></td>,
        <td key="payment_empty"></td>,
      ];
    }
  };

  const handleActionClick = (order_id: number, action: "agree" | "reject") => {
    setModal({ type: action, order_id });
  };

  const handlePaymentClick = (order_id: number) => {
    setModal({ type: "payment", order_id });
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Order</h1>
      </div>

      <div className={styles.tabs_section}>
        <Tabs tabs={tabs} active={activeTab} />
      </div>

      <div className={styles.table}>
        <Table headers={getTableHeaders()} filters={getFilterColumns()}>
          {data.map((item) => (
            <tr key={item.order_id}>
              <td>{item.order_id}</td>
              <td>{item.customer || item.full_name}</td>
              <td>{item.email}</td>
              <td>{item.phone_number || item.phone}</td>

              {activeTab === 0 ? (
                <>
                  <td>{item.country_loading}</td>
                  <td>{item.country_destination}</td>
                  <td>{formatDate(item.created_at || item.end_date)}</td>
                  <td>{item.status}</td>
                  <td>{item.price || item.total_price}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        className={styles.icon}
                        onClick={() =>
                          handleActionClick(item.order_id, "agree")
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className={styles.icon__2}>
                          <AddIconTable />
                        </div>
                      </div>
                      <div
                        className={styles.icon}
                        onClick={() =>
                          handleActionClick(item.order_id, "reject")
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className={styles.icon__1}>
                          <CrossIcon />
                        </div>
                      </div>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td>{formatDate(item.created_at || item.end_date)}</td>
                  <td>{item.status}</td>
                  <td>{item.price || item.total_price}</td>
                  <td>{item.balance || "0"}</td>
                  <td>{item.max_credit_limit || "0"}</td>
                  <td>{item.out_standing_amount || "0"}</td>
                  <td>{formatDate(item.end_payment_date)}</td>
                  <td>
                    <div className={styles.icon}>
                      <div
                        className={styles.icon__2}
                        onClick={() => handlePaymentClick(item.order_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <PenIcon />
                      </div>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pg) => setPage(pg)}
        />

        {modal && modal.type !== "payment" && (
          <AgreeOrder
            modalClose={(isRender) => {
              setModal(null);
              if (isRender) {
                setPageHelper((prev) => ({ ...prev, render: !prev.render }));
              }
            }}
            order_id={modal.order_id}
            actionType={modal.type}
          />
        )}

        {modal && modal.type === "payment" && (
          <AddPayment
            modalClose={(isRender) => {
              setModal(null);
              if (isRender) {
                setPageHelper((prev) => ({ ...prev, render: !prev.render }));
              }
            }}
            id={modal.order_id}
          />
        )}
      </div>
    </div>
  );
};

export default AccountantOrder;
