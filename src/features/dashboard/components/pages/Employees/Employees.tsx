import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DeleteIcon,
  PenIcon,
  PlusIcon,
  SharedIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getEmployees } from "@/features/dashboard/services/Employees/employees.service.ts";
import CreateEmployees from "@/features/dashboard/components/shared/Modals/Employees/CreateEmployees.tsx";
import UpdateEmployees from "@/features/dashboard/components/shared/Modals/Employees/UpdateEmployees.tsx";
import DeleteEmployees from "@/features/dashboard/components/shared/Modals/Employees/DeleteEmployees.tsx";
import { useTranslation } from "react-i18next";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import SelectManager from "@/features/dashboard/components/shared/Modals/CommericalDirectory/SelectManager.tsx";

const filterKeys = ["fullname", "email", "phone"] as const;

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  fin_code: string;
  role: string;
}

const Employees = () => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
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
    | { type: "manager" }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

  const roles = [
    "buyer_manager",
    "buyer_directory",
    "commercial_directory",
    "commercial_manager",
    "commercial_specialist",
    "lawyer",
    "accountant",
    "monitoring",
  ];

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

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Employees</h1>
        <Button
          text="Add Employees"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                setFilters((prev) => ({ ...prev, role }));
                setPage(1);
              }}
              className={`${styles.roleButton} ${
                filters.role === role ? styles.activeRole : ""
              }`}
            >
              {t(`workers.roles.${role}`)}
            </button>
          ))}
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
            ...(filters.role === "commercial_specialist"
              ? [{ name: "Select Manager" }]
              : []),
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
              {filters.role === "commercial_specialist" ? <td></td> : ""}
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
              {filters.role === "commercial_specialist" && (
                <td>
                  <div
                    className={styles.manager}
                    onClick={() => {
                      setSelectedUserId(item.id);
                      setModal({ type: "manager" });
                    }}
                  >
                    {item.commercial_manager || "Seçilməyib"}
                    <SharedIcon />
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

      {createModal}
      {updateModal}
      {deleteModal}
    </div>
  );
};

export default Employees;
