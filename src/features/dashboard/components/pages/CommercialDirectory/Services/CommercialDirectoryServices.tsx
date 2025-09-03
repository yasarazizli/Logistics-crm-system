import { useContext, useEffect, useState } from "react";
import styles from "@/features/dashboard/components/pages/Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FileIcon,
  PenIcon,
  VectorIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllServices } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import AddPrice from "@/features/dashboard/components/shared/Modals/CommericalDirectory/AddPrice.tsx";
import ApprovePrice from "@/features/dashboard/components/shared/Modals/CommericalDirectory/ApprovePrice.tsx";

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
  selling_price_ton: number;
  selling_price_unit: number;
  min_selling_price?: number;
  contract?: string;
  contract_expired?: string;
  protocol?: string;
  language: string;
  protocol_expired?: string;
}
const filterKeys = [
  "vendor_name",
  "service_name",
  "purchase_price_unit",
  "purchase_price_ton",
  "selling_price_unit",
  "selling_price_ton",
  "contract_expired",
  "protocol_expired",
] as const;

const Services = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    vendor_name: "",
    service_name: "",
    purchase_price_unit: "",
    purchase_price_ton: "",
    selling_price_unit: "",
    selling_price_ton: "",
    contract_expired: "",
    protocol_expired: "",
  });

  const [modal, setModal] = useState<
    null | { type: "create"; id: number } | { type: "confirm"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    vendor_name: useDebounce(filters.vendor_name, 700),
    service_name: useDebounce(filters.service_name, 700),
    purchase_price_unit: useDebounce(filters.purchase_price_unit, 700),
    purchase_price_ton: useDebounce(filters.purchase_price_ton, 700),
    selling_price_unit: useDebounce(filters.selling_price_unit, 700),
    selling_price_ton: useDebounce(filters.selling_price_ton, 700),
    contract_expired: useDebounce(filters.contract_expired, 700),
    protocol_expired: useDebounce(filters.protocol_expired, 700),
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
        console.log(response?.data);
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

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Services</h1>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Vendor Name" },
            { name: "Services Name" },
            { name: "Price per Unit" },
            { name: "Price per ton" },
            { name: "Selling Price per Unit" },
            { name: "Selling Price per Ton" },
            { name: "Contract expired date" },
            { name: "Protocol expired date" },
            { name: "Contract document" },
            { name: "Contract document Language" },
            { name: "Price Edit" },
          ]}
          filters={
            <>
              {filterKeys.map((key) => (
                <td key={key}>
                  <input
                    type={key.includes("date") ? "date" : "text"}
                    placeholder={`Filter by ${key.replace(/_/g, " ")}`}
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
              <td>{item.vendor}</td>
              <td>{item.service}</td>
              <td>{item.purchase_price_unit}</td>
              <td>{item.purchase_price_ton}</td>
              <td>{item.selling_price_unit}</td>
              <td>{item.selling_price_ton}</td>
              <td>
                {item.contract_expired
                  ? new Date(item.contract_expired).toISOString().split("T")[0]
                  : "-"}
              </td>
              <td>
                {item.protocol_expired
                  ? new Date(item.protocol_expired).toISOString().split("T")[0]
                  : "-"}
              </td>
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
              <td>{item.language}</td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__3}
                    onClick={() => setModal({ type: "confirm", id: item.id })}
                  >
                    <VectorIcon />
                  </div>
                  <div
                    className={styles.icon__2}
                    onClick={() => setModal({ type: "create", id: item.id })}
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

      {modal?.type === "create" && (
        <AddPrice
          id={modal.id}
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}
      {modal?.type === "confirm" && (
        <ApprovePrice
          id={modal.id}
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}
    </div>
  );
};

export default Services;
