import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllServices } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import CreateVendor from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateVendor.tsx";
import CreateServices from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateServices.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";

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
  "location",
  "vendor_name",
  "service_name",
  "transport_mode",
  "from_name",
  "to_name",
  "transport_type",
] as const;

const Services = () => {
  const { setLoader } = useContext(LoaderContext);
  const [filters, setFilters] = useState({
    country_name: "",
    vendor_name: "",
    location: "",
    service_name: "",
    transport_mode: "",
    from_name: "",
    to_name: "",
    transport_type: "",
  });

  const [modal, setModal] = useState<
    null | { type: "create" } | { type: "add" }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    country_name: useDebounce(filters.country_name, 700),
    vendor_name: useDebounce(filters.vendor_name, 700),
    location: useDebounce(filters.location, 700),
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

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Services</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <Button
            text="Add vendor"
            viewType="green__light"
            icon={PlusIcon}
            onClick={() => setModal({ type: "add" })}
          />
          <Button
            text="Add Services"
            viewType="green__light"
            icon={PlusIcon}
            onClick={() => setModal({ type: "create" })}
          />
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Country" },
            { name: "Location" },
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
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.country}</td>
              <td>{item.location}</td>
              <td>{item.vendor}</td>
              <td>{item.service}</td>
              <td>{item.transport_mode}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.transport_type}</td>
              <td>{item.purchase_price_ton}</td>
              <td>{item.purchase_price_unit}</td>
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
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pg) => setPage(pg)}
        />
      </div>

      {modal?.type === "add" && (
        <CreateVendor
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}
      {modal?.type === "create" && (
        <CreateServices
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
