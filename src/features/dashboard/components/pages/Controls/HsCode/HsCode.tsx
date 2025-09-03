import { useContext, useEffect, useState } from "react";
import styles from "./HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DeleteIcon,
  PenIcon,
  PlusIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { HsCodeRequest } from "@/features/dashboard/services/Controls/hscode.service.ts";
import CreateHsCode from "@/features/dashboard/components/shared/Modals/HsCode/CreateHsCode.tsx";
import UpdateHsCode from "@/features/dashboard/components/shared/Modals/HsCode/UpdateHsCode.tsx";
import DeleteHsCode from "@/features/dashboard/components/shared/Modals/HsCode/DeleteHsCode.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

const filterKeys = [
  "cargo",
  "code",
  "description",
  "created",
  "updated",
] as const;

interface HsCode {
  cargo: string;
  code: string;
  description: string;
}

const HsCode = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    cargo: "",
    code: "",
    description: "",
    created: "",
    updated: "",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "update"; id: number; value: HsCode }
    | { type: "delete"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    cargo: useDebounce(filters.cargo, 700),
    code: useDebounce(filters.code, 700),
    description: useDebounce(filters.description, 700),
    created: useDebounce(filters.created, 700),
    updated: useDebounce(filters.updated, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await HsCodeRequest(
        page,
        pageSize,
        debouncedFilters.cargo,
        debouncedFilters.code,
        debouncedFilters.description,
        debouncedFilters.created,
        debouncedFilters.updated,
      );
      if (response?.status === 200) {
        setData(response.data?.data || []);
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

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const createModal = modal?.type === "create" && (
    <CreateHsCode
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const updateModal = modal?.type === "update" && (
    <UpdateHsCode
      value={modal?.value}
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const deleteModal = modal?.type === "delete" && (
    <DeleteHsCode
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>HS Code</h1>
        <Button
          text="Add Hs Code"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "ID" },
            { name: "Cargo" },
            { name: "Code" },
            { name: "Description" },
            { name: "Created" },
            { name: "Updated" },
            { name: "" },
          ]}
          filters={
            <>
              <td></td>
              {filterKeys.map((key) => (
                <td key={key}>
                  <input
                    type={
                      key === "created" || key === "updated" ? "date" : "text"
                    }
                    placeholder={`Filter by ${key}`}
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
              <td>{item.id}</td>
              <td>{item.cargo}</td>
              <td>{item.code}</td>
              <td>{item.description}</td>
              <td>{formatDate(item.created)}</td>
              <td>{formatDate(item.updated)}</td>
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
                      setModal({ type: "update", id: item.id, value: item })
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

      {createModal}
      {updateModal}
      {deleteModal}
    </div>
  );
};

export default HsCode;
