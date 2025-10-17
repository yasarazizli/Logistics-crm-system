import { useContext, useEffect, useState } from "react";
import styles from "../../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { getAllInvoices } from "@/features/dashboard/services/Accountant/accountant.service.ts";
import { AddIconTable, CrossIcon } from "@/assets/icons/order.vectors.tsx";
import AgreeBalance from "@/features/dashboard/components/shared/Modals/Accountant/AgreeBalance.tsx";

const Balance = () => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    invoice_status: "",
    user: "",
    date: "",
    amount: "",
    not: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [modal, setModal] = useState<null | {
    type: "agree" | "reject";
    id: number;
  }>(null);
  const [pageHelper, setPageHelper] = useState({ render: false });

  const debouncedFilters = {
    invoice_status: filters.invoice_status,
    user: useDebounce(filters.user, 700),
    date: useDebounce(filters.date, 700),
    amount: useDebounce(filters.amount, 700),
    not: useDebounce(filters.not, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllInvoices({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        console.log("data", response.data?.invoices);
        console.log("data", response.data);
        setData(response.data.invoices || []);
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

  const contract = ["reject", "approved", "waiting"];

  const handleActionClick = (id: number, action: "agree" | "reject") => {
    setModal({ type: action, id });
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Balance Activities</h1>
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          {contract.map((role) => (
            <button
              key={role}
              onClick={() => {
                setFilters((prev) => ({ ...prev, invoice_status: role }));
                setPage(1);
              }}
              className={`${styles.roleButton} ${
                filters.invoice_status === role ? styles.activeRole : ""
              }`}
            >
              {t(`services.balance.${role}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Customer" },
            { name: "Financer" },
            { name: "Date" },
            { name: "Amount" },
            { name: "Note" },
            { name: "Document" },
            { name: "Edit" },
          ]}
          filters={
            <>
              <td>
                <input
                  placeholder="Filter by name"
                  value={filters.user}
                  onChange={(e) => handleFilterChange(e, "user")}
                />
              </td>
              <td></td>
              <td>
                <input
                  placeholder="Date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange(e, "date")}
                />
              </td>
              <td>
                <input
                  placeholder="Amount"
                  value={filters.amount}
                  onChange={(e) => handleFilterChange(e, "amount")}
                />
              </td>
              <td>
                <input
                  placeholder="Note"
                  value={filters.not}
                  onChange={(e) => handleFilterChange(e, "not")}
                />
              </td>
              <td></td>
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.user}</td>
              <td>{item.accountant}</td>
              <td>{item.created}</td>
              <td>{item.amount}</td>
              <td>{item.not}</td>
              <td>
                <div className={styles.document}>
                  File
                  {item.document ? (
                    <a
                      href={item.document}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className={styles.file__icon}>
                        <FileIcon />
                      </div>
                    </a>
                  ) : (
                    " - "
                  )}
                </div>
              </td>

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
                    onClick={() => handleActionClick(item.id, "agree")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.icon__2}>
                      <AddIconTable />
                    </div>
                  </div>
                  <div
                    className={styles.icon}
                    onClick={() => handleActionClick(item.id, "reject")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.icon__1}>
                      <CrossIcon />
                    </div>
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

        {modal && (
          <AgreeBalance
            modalClose={(isRender) => {
              setModal(null);
              if (isRender) {
                setPageHelper((prev) => ({ ...prev, render: !prev.render }));
              }
            }}
            id={modal.id}
            actionType={modal.type}
          />
        )}
      </div>
    </div>
  );
};

export default Balance;
