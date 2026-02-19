import { useContext, useEffect, useState } from "react";
import styles from "../../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { EyesIcon, FileIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllServices } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { AddIconTable, CrossIcon } from "@/assets/icons/order.vectors.tsx";
import ServicesEdit from "@/features/dashboard/components/shared/Modals/Monitoring/ServicesEdit.tsx";
import EditServices from "@/features/dashboard/components/shared/Modals/Services&Vendor/EditServices.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";

interface Service {
  id: number;
  country: string;
  location: string;
  vendor: string;
  service: string;
  transport_mode: string;
  from: string;
  to: string;
  transport_type: string;
  purchase_price_ton: number;
  purchase_price_unit: number;
  min_selling_price?: number;
  contract?: string;
  contract_expired?: string;
  protocol?: string;
  protocol_expired?: string;
}

const filterKeys = [
  "country_name",
  "vendor_name",
  "service_name",
  "transport_mode",
  "from_name",
  "to_name",
  "transport_type",
] as const;

const ServicesMonitoring = () => {
  const { setLoader } = useContext(LoaderContext);
  const { auth } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    country_name: "",
    vendor_name: "",
    service_name: "",
    transport_mode: "",
    from_name: "",
    to_name: "",
    transport_type: "",
  });

  const [modal, setModal] = useState<null | {
    type: "agree" | "reject" | "detail";
    id: number;
  }>(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    country_name: useDebounce(filters.country_name, 700),
    vendor_name: useDebounce(filters.vendor_name, 700),
    service_name: useDebounce(filters.service_name, 700),
    transport_mode: useDebounce(filters.transport_mode, 700),
    from_name: useDebounce(filters.from_name, 700),
    to_name: useDebounce(filters.to_name, 700),
    transport_type: useDebounce(filters.transport_type, 700),
  };

  const [data, setData] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllServices({
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
    setFilters((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  const handleActionClick = (id: number, action: "agree" | "reject") => {
    setModal({ type: action, id });
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Services</h1>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Country" },
            { name: "Vendor" },
            { name: "Service" },
            { name: "Transport Mode" },
            { name: "From" },
            { name: "To" },
            { name: "Transport Type" },
            { name: "Purchase Price Per Unity" },
            { name: "Purchase Price Per Ton" },
            { name: "Contract File" },
            { name: "Contract Date" },
            { name: "Protocol" },
            { name: "Protocol Date" },
            { name: "Edit" },
            { name: "Detail" },
          ]}
          filters={
            <>
              {filterKeys.map((key) => (
                <td key={key}>
                  <input
                    placeholder={`Filter by ${key.replace("_", " ")}`}
                    value={filters[key]}
                    onChange={(e) => handleFilterChange(e, key)}
                  />
                </td>
              ))}
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.country}</td>
              <td>{item.vendor}</td>
              <td>{item.service}</td>
              <td>{item.transport_mode}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.transport_type}</td>
              <td>{item.purchase_price_unit}</td>
              <td>{item.purchase_price_ton}</td>
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
                {item.contract_expired
                  ? new Date(item.contract_expired).toISOString().split("T")[0]
                  : "-"}
              </td>
              <td>
                <div className={styles.document}>
                  File
                  {item.protocol ? (
                    <a
                      href={item.protocol}
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
                {item.protocol_expired
                  ? new Date(item.protocol_expired).toISOString().split("T")[0]
                  : "-"}
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    className={styles.icon}
                    onClick={() => handleActionClick(item.id, "agree")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.icon__2}>
                      <AddIconTable />
                    </div>
                  </div>
                  <div
                    className={styles.icon}
                    onClick={() => handleActionClick(item.id, "reject")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className={styles.icon__1}>
                      <CrossIcon />
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__3}
                    onClick={() => setModal({ type: "detail", id: item.id })}
                  >
                    <EyesIcon />
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

        {modal?.type && (
          <ServicesEdit
            modalClose={(isRender) => {
              setModal(null);
              if (isRender) {
                setPageHelper((prev) => ({ ...prev, render: !prev.render }));
              }
            }}
            id={modal.id}
            actionType={modal.type}
          />
        )}
        {modal?.type === "detail" && (
          <EditServices
            modalClose={() => {
              setModal(null);
              setPageHelper((prev) => ({ ...prev, render: !prev.render }));
            }}
            selectedId={modal.id}
            role={auth.role}
          />
        )}
      </div>
    </div>
  );
};

export default ServicesMonitoring;
