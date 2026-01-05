import { useContext, useEffect, useState } from "react";
import styles from "@/features/dashboard/components/pages/Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FileIcon,
  PlusIcon,
  SharedIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllUsers } from "@/features/dashboard/services/CommercialDirectory/commercial.services.ts";
import CreateDirectory from "@/features/dashboard/components/shared/Modals/CommericalDirectory/CreateDirectory.tsx";
import SelectManager from "@/features/dashboard/components/shared/Modals/CommericalDirectory/SelectManager.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";

interface CD {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: boolean;
  balance: number;
  contract: string;
  contract_start_date: string;
  contract_end_date: string;
  company_name: string;
  commercial_manager: string;
  accountant: string;
}

const filterKeys = [
  "full_name",
  "email",
  "phone",
  "company_name",
  "balance",
  "contract",
  "start_date",
  "end_date",
] as const;

const CommercialDirectory = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    balance: "",
    contract: "",
    start_date: "",
    end_date: "",
  });

  const debouncedFilters = {
    full_name: useDebounce(filters.full_name, 700),
    email: useDebounce(filters.email, 700),
    phone: useDebounce(filters.phone, 700),
    company_name: useDebounce(filters.company_name, 700),
    balance: useDebounce(filters.balance, 700),
    contract: useDebounce(filters.contract, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  const [data, setData] = useState<CD[]>([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState<
    null | { type: "create" } | { type: "manager" } | { type: "accountant" }
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [pageHelper, setPageHelper] = useState({ render: false });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllUsers({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        setData(response.data?.users || []);
        setTotal(response.data?.page_count || 0);
      }
      setLoader(false);
    };
    fetchData();
    setLoader(false);
  }, [page, pageHelper.render, ...Object.values(debouncedFilters)]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    setPage(1);
  };

  const handleManagerSelect = (employee: { id: number; full_name: string }) => {
    if (!selectedUserId) return;
    setData((prev) =>
      prev.map((user) =>
        user.id === selectedUserId
          ? { ...user, commercial_manager: employee.full_name }
          : user,
      ),
    );
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Clients</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Button
            text="Create user"
            viewType="green__light"
            icon={PlusIcon}
            onClick={() => setModal({ type: "create" })}
          />
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Customer" },
            { name: "E-mail address" },
            { name: "Phone number" },
            { name: "Company Name" },
            { name: "Balance" },
            { name: "Contract document" },
            { name: "Contract Start Date" },
            { name: "Contract End Date" },
            { name: "Commercial manager" },
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
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.full_name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td>{item.company_name}</td>
              <td>{item.balance}</td>
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
                    " - "
                  )}
                </div>
              </td>
              <td>
                {item.contract_start_date
                  ? new Date(item.contract_start_date)
                      .toISOString()
                      .split("T")[0]
                  : "-"}
              </td>
              <td>
                {item.contract_end_date
                  ? new Date(item.contract_end_date).toISOString().split("T")[0]
                  : "-"}
              </td>
              <td>
                <div
                  className={styles.manager}
                  onClick={() => {
                    setSelectedUserId(item.id);
                    setModal({ type: "manager" });
                  }}
                >
                  {item.commercial_manager || "Not selected"}
                  <SharedIcon />
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

      {modal?.type === "create" && (
        <CreateDirectory
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}
      {modal?.type === "manager" && selectedUserId && (
        <SelectManager
          modalClose={() => {
            setModal(null);
            setSelectedUserId(null);
          }}
          id={selectedUserId}
          onSelect={handleManagerSelect}
        />
      )}
    </div>
  );
};

export default CommercialDirectory;
