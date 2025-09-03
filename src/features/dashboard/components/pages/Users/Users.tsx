import { useContext, useEffect, useRef, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DeleteIcon,
  GreenAddIcon,
  PenIcon,
  PlusIcon,
  YellowPlusIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getEmployees } from "@/features/dashboard/services/Employees/employees.service.ts";
import CreateEmployees from "@/features/dashboard/components/shared/Modals/Employees/CreateEmployees.tsx";
import UpdateEmployees from "@/features/dashboard/components/shared/Modals/Employees/UpdateEmployees.tsx";
import DeleteEmployees from "@/features/dashboard/components/shared/Modals/Employees/DeleteEmployees.tsx";
import { useTranslation } from "react-i18next";
import { checkRequest } from "@/features/auth/services/auth.service.ts";
import AddBalance from "@/features/dashboard/components/shared/Modals/Users/AddBalance.tsx";
import AddContract from "@/features/dashboard/components/shared/Modals/Users/AddContract.tsx";

const filterKeys = ["fullname", "email", "phone"] as const;

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  fin_code: string;
  role: string;
}

const Users = () => {
  const dataRef = useRef<any>(null);
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    fullname: "",
    email: "",
    phone: "",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "update"; id: number; employee: Employee }
    | { type: "delete"; id: number }
    | { type: "add" }
    | { type: "contract"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    fullname: useDebounce(filters.fullname, 700),
    email: useDebounce(filters.email, 700),
    phone: useDebounce(filters.phone, 700),
    role: filters.role,
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getEmployees(
        page,
        pageSize,
        debouncedFilters.fullname,
        debouncedFilters.email,
        debouncedFilters.phone,
        debouncedFilters.role,
      );
      if (response?.status === 200) {
        console.log("data", response.data?.employee);
        console.log("data", response.data);
        setData(response.data?.employee || []);
        setTotal(response.data?.count || 0);
      }
    };
    fetchData();
    setLoader(false);
  }, [page, pageHelper.render, ...Object.values(debouncedFilters)]);

  useEffect(() => {
    setLoader(true);
    const checkData = async () => {
      const response = await checkRequest();
      if (response?.status === 200) {
        console.log("checkData", response.data);
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

  const addModal = modal?.type === "add" && (
    <AddBalance
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const addPopaps = modal?.type === "contract" && (
    <AddContract
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const createModal = modal?.type === "create" && (
    <CreateEmployees
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const updateModal = modal?.type === "update" && (
    <UpdateEmployees
      employee={modal.employee}
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const deleteModal = modal?.type === "delete" && (
    <DeleteEmployees
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const totalPages = Math.ceil(total / pageSize);

  const status = [
    "pending",
    "offered",
    "ordered",
    "completed",
    "draft",
    "rejected",
  ];

  const statusColors: Record<string, string> = {
    pending: "#F5E233",
    offered: "#F5E233",
    ordered: "#1D7321",
    completed: "#1D7321",
    draft: "#808080",
    rejected: "#F74156",
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Users</h1>
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
              setModal({ type: "contract", id: dataRef.current.id })
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
            text="Add Order"
            viewType="green__light"
            icon={PlusIcon}
            onClick={() => setModal({ type: "create" })}
          />
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Full Name" },
            { name: "E-mail" },
            { name: "Phone Number" },
            { name: "Role" },
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
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.full_name}</td>
              <td>{item.email}</td>
              <td>{item.phone}</td>
              <td> {t(`workers.roles.${item.role}`)}</td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__1}
                    onClick={() => setModal({ type: "delete", id: item.id })}
                  >
                    <DeleteIcon />
                  </div>
                  <div
                    className={styles.icon__2}
                    onClick={() =>
                      setModal({ type: "update", id: item.id, employee: item })
                    }
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

      {addPopaps}
      {addModal}
      {createModal}
      {updateModal}
      {deleteModal}
    </div>
  );
};

export default Users;
