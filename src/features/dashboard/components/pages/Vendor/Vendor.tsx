import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";
import { getVendorRequest } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import CreateVendor from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateVendor.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";

const Vendor = () => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    contract_status: "",
    name: "",
    start_date: "",
    end_date: "",
  });

  const [modal, setModal] = useState<null | { type: "create" }>(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    contract_status: filters.contract_status,
    name: useDebounce(filters.name, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getVendorRequest({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        setData(response.data?.vendors || []);
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

  const createModal = modal?.type === "create" && (
    <CreateVendor
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const totalPages = Math.ceil(total / pageSize);

  const contract = ["empty", "verified", "unverified"];

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Vendors</h1>
        <Button
          text="Add Vendor"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          {contract.map((role) => (
            <button
              key={role}
              onClick={() => {
                setFilters((prev) => ({ ...prev, contract_status: role }));
                setPage(1);
              }}
              className={`${styles.roleButton} ${
                filters.contract_status === role ? styles.activeRole : ""
              }`}
            >
              {t(`services.vendor.${role}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Vendor name" },
            { name: "Contract" },
            { name: "Contract Start Date" },
            { name: "Contract End Date" },
            { name: "Contract document language" },
          ]}
          filters={
            <>
              <td>
                <input
                  placeholder="Filter by name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange(e, "name")}
                />
              </td>
              <td></td>
              <td>
                <input
                  type="date"
                  placeholder="Start date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange(e, "start_date")}
                />
              </td>
              <td>
                <input
                  type="date"
                  placeholder="End date"
                  value={filters.end_date}
                  onChange={(e) => handleFilterChange(e, "end_date")}
                />
              </td>
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
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
              <td>{item.contract_language}</td>
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pg) => setPage(pg)}
        />
      </div>

      {createModal}
    </div>
  );
};

export default Vendor;
