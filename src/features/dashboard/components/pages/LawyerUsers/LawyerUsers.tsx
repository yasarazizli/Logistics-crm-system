import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DeleteIcon,
  FileIcon,
  PenIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";
import { getLawyerUser } from "@/features/dashboard/services/LawyerUsers/lawyerusers.service.ts";
import VerifyLawyer from "@/features/dashboard/components/shared/Modals/LawyerUsers/VerifyLawyer.tsx";
import DeleteLawyerUser from "@/features/dashboard/components/shared/Modals/LawyerUsers/DeleteLawyer.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";

const filterKeys = ["fullname", "phone", "email", "companyname"] as const;

interface Lawyer {
  phone: string;
  contract_start_date: string;
  contract_end_date: string;
}

const LawyerUser = () => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    contract_status: "",
    fullname: "",
    phone: "",
    email: "",
    companyname: "",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "update"; id: number; lawyer: Lawyer }
    | { type: "delete"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    fullname: useDebounce(filters.fullname, 700),
    email: useDebounce(filters.email, 700),
    phone: useDebounce(filters.phone, 700),
    company_name: useDebounce(filters.companyname, 700),
    contract_status: filters.contract_status,
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getLawyerUser(
        page,
        pageSize,
        debouncedFilters.fullname,
        debouncedFilters.email,
        debouncedFilters.phone,
        debouncedFilters.company_name,
        debouncedFilters.contract_status,
      );
      if (response?.status === 200) {
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
    <VerifyLawyer
      lawyer={modal.lawyer}
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const deleteModal = modal?.type === "delete" && (
    <DeleteLawyerUser
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

  const roles = ["verified", "unverified", "empty"];

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Clients</h1>
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          {roles.map((role) => (
            <button
              className={`${styles.roleButton} ${
                filters.contract_status === role ? styles.activeRole : ""
              }`}
              key={role}
              onClick={() => {
                setFilters((prev) => ({ ...prev, contract_status: role }));
                setPage(1);
              }}
            >
              {t(`workers.verified.${role}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Customer" },
            { name: "Phone number" },
            { name: "E-mail address" },
            { name: "Company name" },
            { name: "Invoice document" },
            { name: "Validitity date" },
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
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.full_name}</td>
              <td>{item.phone}</td>
              <td>{item.email}</td>
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
                    " - "
                  )}
                </div>
              </td>

              <td>
                {formatDate(item.contract_start_date)} -{" "}
                {formatDate(item.contract_end_date)}
              </td>

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
                      setModal({ type: "update", id: item.id, lawyer: item })
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
      </div>

      {updateModal}
      {deleteModal}
    </div>
  );
};

export default LawyerUser;
