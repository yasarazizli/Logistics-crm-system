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
import { StationRequest } from "@/features/dashboard/services/Controls/station.service.ts";
import CreateStation from "@/features/dashboard/components/shared/Modals/Station/CreateStation.tsx";
import UpdateStation from "@/features/dashboard/components/shared/Modals/Station/UpdateStation.tsx";
import DeleteStation from "@/features/dashboard/components/shared/Modals/Station/DeleteStation.tsx";

const filterKeys = ["name", "code", "country"] as const;

interface Station {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  pole: string;
}

const Station = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    name: "",
    code: "",
    country: "",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "update"; id: number; station: Station }
    | { type: "delete"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    name: useDebounce(filters.name, 700),
    code: useDebounce(filters.code, 700),
    country: useDebounce(filters.country, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await StationRequest(
        page,
        pageSize,
        debouncedFilters.name,
        debouncedFilters.code,
        debouncedFilters.country,
      );
      if (response?.status === 200) {
        setData(response.data?.stations || []);
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
    <CreateStation
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const updateModal = modal?.type === "update" && (
    <UpdateStation
      station={modal.station}
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const deleteModal = modal?.type === "delete" && (
    <DeleteStation
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
        <h1>Station</h1>
        <Button
          text="Add station"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "No" },
            { name: "Name" },
            { name: "Code" },
            { name: "Country" },
            { name: "Lat" },
            { name: "Long" },
            { name: "Pole" },
            { name: "" },
          ]}
          filters={
            <>
              <td></td>
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
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.code}</td>
              <td>{item.country}</td>
              <td>{item.latitude}</td>
              <td>{item.longitude}</td>
              <td>{item.pole}</td>
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
                      setModal({ type: "update", id: item.id, station: item })
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

export default Station;
