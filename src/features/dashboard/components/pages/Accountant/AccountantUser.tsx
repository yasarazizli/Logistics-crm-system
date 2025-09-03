import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PenIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAccountantUser } from "@/features/dashboard/services/Accountant/accountant.service.ts";
import AddBalance from "@/features/dashboard/components/shared/Modals/Accountant/AddBalance.tsx";

const filterKeys = ["fullname", "phone", "email", "companyname"] as const;

const AccountantUser = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    fullname: "",
    phone: "",
    email: "",
    companyname: "",
  });

  const [modal, setModal] = useState<null | { type: "update"; id: number }>(
    null,
  );

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    fullname: useDebounce(filters.fullname, 700),
    email: useDebounce(filters.email, 700),
    phone: useDebounce(filters.phone, 700),
    company_name: useDebounce(filters.companyname, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAccountantUser(
        page,
        pageSize,
        debouncedFilters.fullname,
        debouncedFilters.email,
        debouncedFilters.phone,
        debouncedFilters.company_name,
      );
      if (response?.status === 200) {
        console.log("data", response.data?.users);
        console.log("data", response.data?.users);
        setData(response.data?.users || []);
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

  const updateModal = modal?.type === "update" && (
    <AddBalance
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Users</h1>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Customer" },
            { name: "E-mail address" },
            { name: "Phone number" },
            { name: "Company name" },
            { name: "Invoice document" },
            { name: "Validitity date" },
            { name: "Balance" },
            { name: "" },
          ]}
          filters={
            <>
              {filterKeys.map((key) => (
                <td key={key}>
                  <input
                    placeholder={`Filter by ${key}`}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                  />
                </td>
              ))}
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.full_name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.company_name}</td>
              <td>
                <div className={styles.document}>
                  File
                  {item.contract ? (
                    <a
                      href={item.contract}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className={styles.file__icon}>
                        <FileIcon />
                      </div>
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
              </td>

              <td>
                {formatDate(item.contract_start_date)} -{" "}
                {formatDate(item.contract_end_date)}
              </td>
              <td>{item.balance}</td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() => setModal({ type: "update", id: item.id })}
                  >
                    <PenIcon />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <div className={styles.pagination}>
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`${styles.pageButton} ${page === pg ? styles.activePage : ""}`}
              >
                {pg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {updateModal}
    </div>
  );
};

export default AccountantUser;
