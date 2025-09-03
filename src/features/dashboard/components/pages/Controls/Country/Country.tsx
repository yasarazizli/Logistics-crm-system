import { useContext, useEffect, useState } from "react";
import styles from "../HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  DeleteIcon,
  PenIcon,
  PlusIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { CountryRequest } from "@/features/dashboard/services/Controls/country.service.ts";
import CreateDate from "@/features/dashboard/components/shared/Modals/Date/CreateDate.tsx";
import UpdateDate from "@/features/dashboard/components/shared/Modals/Date/UpdateDate.tsx";
import DeleteDate from "@/features/dashboard/components/shared/Modals/Date/DeleteDate.tsx";

const filterKeys = ["country", "date"] as const;

interface Country {
  name: string;
}

const Country = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    country: "",
    date: "",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "update"; id: number; country: Country }
    | { type: "delete"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    country: useDebounce(filters.country, 700),
    date: useDebounce(filters.date, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await CountryRequest(
        page,
        pageSize,
        debouncedFilters.country,
        debouncedFilters.date,
      );
      if (response?.status === 200) {
        console.log("data", response.data?.data);
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
    <CreateDate
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const updateModal = modal?.type === "update" && (
    <UpdateDate
      country={modal.country}
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const deleteModal = modal?.type === "delete" && (
    <DeleteDate
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
        <h1>Country</h1>
        <Button
          text="Add Country"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Row" },
            { name: "Countries" },
            { name: "Date" },
            { name: "" },
          ]}
          filters={
            <>
              <td></td>
              {filterKeys.map((key) => (
                <td key={key}>
                  <input
                    type={key === "date" ? "date" : "text"}
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
              <td>{item.name}</td>
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
                      setModal({ type: "update", id: item.id, country: item })
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

export default Country;
