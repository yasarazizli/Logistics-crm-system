import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import CreateVendor from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateVendor.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { getAllNotifications } from "@/features/dashboard/services/Notification/notification.service.ts";

const Notification = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    date: "",
  });

  const [modal, setModal] = useState<null | { type: "create" }>(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    name: useDebounce(filters.name, 700),
    role: useDebounce(filters.role, 700),
    date: useDebounce(filters.date, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllNotifications({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        console.log("data", response.data?.data);
        console.log("data", response.data);
        setData(response.data?.data || []);
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

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Notification</h1>
      </div>
      <div className={styles.table}>
        <Table
          headers={[
            { name: "Notification Description" },
            { name: "Sender" },
            { name: "Role" },
            { name: "Date" },
          ]}
          filters={
            <>
              <td></td>
              <td>
                <input
                  placeholder="Filter by name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange(e, "name")}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Role"
                  value={filters.role}
                  onChange={(e) => handleFilterChange(e, "role")}
                />
              </td>
              <td>
                <input
                  type="date"
                  placeholder="Date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange(e, "date")}
                />
              </td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.notification}</td>
              <td>{item.name}</td>
              <td>{item.role}</td>
              <td>
                {item.date
                  ? new Date(item.date).toISOString().split("T")[0]
                  : "-"}
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
    </div>
  );
};

export default Notification;
