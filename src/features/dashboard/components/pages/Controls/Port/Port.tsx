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
import { PortRequest } from "@/features/dashboard/services/Controls/port.service.ts";
import CreatePort from "@/features/dashboard/components/shared/Modals/Port/CreatePort.tsx";
import UpdatePort from "@/features/dashboard/components/shared/Modals/Port/UpdatePort.tsx";
import DeletePort from "@/features/dashboard/components/shared/Modals/Port/DeletePort.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";

const filterKeys = ["port", "country"] as const;

interface Port {
  name: string;
}

const Port = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    port: "",
    country: "",
  });

  const [modal, setModal] = useState<
    | null
    | { type: "create" }
    | { type: "update"; id: number; port: Port }
    | { type: "delete"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    port: useDebounce(filters.port, 700),
    country: useDebounce(filters.country, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await PortRequest(
        page,
        pageSize,
        debouncedFilters.port,
        debouncedFilters.country,
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

  const createModal = modal?.type === "create" && (
    <CreatePort
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const updateModal = modal?.type === "update" && (
    <UpdatePort
      port={modal.port}
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const deleteModal = modal?.type === "delete" && (
    <DeletePort
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
        <h1>Port</h1>
        <Button
          text="Add Port"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal({ type: "create" })}
        />
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Row" },
            { name: "Port" },
            { name: "Country" },
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
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.country}</td>
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
                      setModal({ type: "update", id: item.id, port: item })
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

      {createModal}
      {updateModal}
      {deleteModal}
    </div>
  );
};

export default Port;
