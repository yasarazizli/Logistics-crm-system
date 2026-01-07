import { useContext, useEffect, useState } from "react";
import styles from "@/features/dashboard/components/pages/Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PenIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllUsers } from "@/features/dashboard/services/CommercialDirectory/commercial.services.ts";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import Button from "@/components/Button/Button.tsx";
import CreateDirectory from "@/features/dashboard/components/shared/Modals/CommericalDirectory/CreateDirectory.tsx";
import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
import UsersEdit from "@/features/dashboard/components/shared/Modals/Users/UsersEdit.tsx";

interface CD {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  balance: number;
  contract: string;
  contract_start_date: string;
  contract_end_date: string;
  company_name: string;
  commercial_manager: string;
  accountant: string;
  is_active: boolean;
}

const filterKeys = [
  "full_name",
  "email",
  "phone",
  "company_name",
  "balance",
  "start_date",
  "end_date",
] as const;

const AdminUsers = () => {
  const { setLoader } = useContext(LoaderContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  const [filters, setFilters] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    balance: "",
    start_date: "",
    end_date: "",
    is_active: undefined as boolean | undefined,
  });

  const debouncedFilters = {
    full_name: useDebounce(filters.full_name, 700),
    email: useDebounce(filters.email, 700),
    phone: useDebounce(filters.phone, 700),
    company_name: useDebounce(filters.company_name, 700),
    balance: useDebounce(filters.balance, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
    is_active: filters.is_active,
  };

  const [data, setData] = useState<CD[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [modal, setModal] = useState<
    null | { type: "create" } | { type: "edit"; id: number; user: CD }
  >(null);
  const [pageHelper, setPageHelper] = useState({ render: false });
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
  }, [page, pageHelper, ...Object.values(debouncedFilters)]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    setPage(1);
  };

  const handleStatusFilter = (value: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, is_active: value }));
    setPage(1);
  };

  const handleToggleStatus = async (user: CD) => {
    const newStatus = !user.is_active;

    setData((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)),
    );

    setUpdatingId(user.id);

    try {
      const formData = new FormData();
      formData.append("ban", String(newStatus));

      await axios.put(`${apiUrl}/accounts/ban/?id=${user.id}`, formData, {
        headers: {
          Authorization: getCookie("allianceToken"),
        },
      });
    } catch (err) {
      setData((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_active: user.is_active } : u,
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Clients</h1>
        <Button
          text="Add Clients"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          <button
            className={`${styles.roleButton} ${
              filters.is_active === undefined ? styles.activeRole : ""
            }`}
            onClick={() => handleStatusFilter(undefined)}
          >
            All
          </button>

          <button
            className={`${styles.roleButton} ${
              filters.is_active === true ? styles.activeRole : ""
            }`}
            onClick={() => handleStatusFilter(true)}
          >
            Deactive
          </button>

          <button
            className={`${styles.roleButton} ${
              filters.is_active === false ? styles.activeRole : ""
            }`}
            onClick={() => handleStatusFilter(false)}
          >
            Active
          </button>
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
            { name: "Financier" },
            { name: "Account Status" },
            { name: "Action" },
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
                {item.contract ? (
                  <a href={item.contract} target="_blank">
                    <FileIcon />
                  </a>
                ) : (
                  "-"
                )}
              </td>

              <td>{item.contract_start_date || "-"}</td>
              <td>{item.contract_end_date || "-"}</td>
              <td>{item.commercial_manager}</td>
              <td>{item.accountant}</td>

              <td>
                <div
                  className={`${styles.toggle} ${
                    item.is_active ? styles.inactive : styles.active
                  } ${updatingId === item.id ? styles.disabled : ""}`}
                  onClick={() => (updatingId ? null : handleToggleStatus(item))}
                >
                  <span />
                  <p>{item.is_active ? "Inactive" : "Active"}</p>
                </div>
              </td>

              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() =>
                      setModal({ type: "edit", id: item.id, user: item })
                    }
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

        {modal?.type === "create" && (
          <CreateDirectory
            modalClose={() => {
              setModal(null);
              setPageHelper((p) => ({ ...p, render: !p.render }));
            }}
          />
        )}
        {modal?.type === "edit" && (
          <UsersEdit
            modalClose={() => {
              setModal(null);
              setPageHelper((prev) => ({ ...prev, render: !prev.render }));
            }}
            id={modal.id}
            user={modal.user}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
