import { useContext, useEffect, useState } from "react";
import styles from "@/features/dashboard/components/pages/Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { PenIcon, SharedIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { GetAllBuyers } from "@/features/dashboard/services/BuyersDirector/buyersdirector.service.ts";
import ChooseManager from "@/features/dashboard/components/shared/Modals/BuyersDirector/ChooseManager.tsx";
import CreateQuotation from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateQuotation.tsx";

interface Buyers {
  id: number;
  service: string;
  location: string;
  transport_mode: string;
  transport_type: boolean;
  from: number;
  to: string;
  buyers: string;
}

const filterKeys = [
  "service_name",
  "location",
  "transport_mode",
  "transport_type",
  "from_name",
  "to_name",
] as const;

const Tasks = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    service_name: "",
    location: "",
    transport_mode: "",
    transport_type: "",
    from_name: "",
    to_name: "",
  });

  const debouncedFilters = {
    service_name: useDebounce(filters.service_name, 700),
    location: useDebounce(filters.location, 700),
    transport_mode: useDebounce(filters.transport_mode, 700),
    transport_type: useDebounce(filters.transport_type, 700),
    from_name: useDebounce(filters.from_name, 700),
    to_name: useDebounce(filters.to_name, 700),
  };

  const [data, setData] = useState<Buyers[]>([]);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState<
    null | { type: "manager" } | { type: "create" }
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [pageHelper, setPageHelper] = useState({ render: false });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const pageSize = 10;

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await GetAllBuyers({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        setData(response.data?.data || []);
        setTotal(response.data?.count || 0);
      }
      setLoader(false);
    };
    fetchData();
    setLoader(false);
  }, [page, pageHelper.render, ...Object.values(debouncedFilters)]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    setPage(1);
  };

  const handleManagerSelect = (employee: { id: number; full_name: string }) => {
    if (!selectedUserId) return;
    setData((prev) =>
      prev.map((user) =>
        user.id === selectedUserId
          ? { ...user, buyer_manager: employee.full_name }
          : user,
      ),
    );
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Tasks</h1>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Service name" },
            { name: "Location" },
            { name: "Transport Mode" },
            { name: "Transport Type" },
            { name: "From" },
            { name: "To" },
            { name: "Choose Specialist" },
            { name: "Add Service" },
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
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.service}</td>
              <td>{item.location}</td>
              <td>{item.transport_mode}</td>
              <td>{item.transport_type}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>
                <div
                  className={styles.manager}
                  onClick={() => {
                    setSelectedUserId(item.id);
                    setModal({ type: "manager" });
                  }}
                >
                  {item.buyers || "Not selected"}
                  <SharedIcon />
                </div>
              </td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() => {
                      setSelectedId(item.id);
                      setModal({ type: "create" });
                    }}
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

      {modal?.type === "manager" && selectedUserId && (
        <ChooseManager
          modalClose={() => {
            setModal(null);
            setSelectedUserId(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
          id={selectedUserId}
          onSelect={handleManagerSelect}
        />
      )}
      {modal?.type === "create" && (
        <CreateQuotation
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
          selectedId={selectedId}
        />
      )}
    </div>
  );
};

export default Tasks;
