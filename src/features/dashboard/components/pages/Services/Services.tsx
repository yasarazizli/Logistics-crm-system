import { useContext, useEffect, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PenIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllServices } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import CreateVendor from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateVendor.tsx";
import CreateServices from "@/features/dashboard/components/shared/Modals/Services&Vendor/CreateServices.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import EditServices from "@/features/dashboard/components/shared/Modals/Services&Vendor/EditServices.tsx";
import axios from "axios";
import { getCookie } from "@/libs/cookie.ts";
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
  from_country: string;
  to_country: string;
  transport_type: string;
  purchase_price_ton: number;
  purchase_price_unit: number;
  min_selling_price?: number;
  contract?: string;
  contract_expired?: string;
  protocol?: string;
  protocol_expired?: string;
  is_active: boolean;
}

const filterKeys = [
  "country_name",
  "vendor_name",
  "service_name",
  "transport_mode",
  "from_name",
  "to_name",
  "from_country",
  "to_country",
  "transport_type",
] as const;

const Services = () => {
  const { setLoader } = useContext(LoaderContext);
  const { auth } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [filters, setFilters] = useState({
    country_name: "",
    vendor_name: "",
    service_name: "",
    transport_mode: "",
    from_name: "",
    to_name: "",
    from_country: "",
    to_country: "",
    transport_type: "",
    is_active: undefined as boolean | undefined,
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [modal, setModal] = useState<
    null | { type: "create" } | { type: "add" } | { type: "edit" }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleToggleStatus = async (user: Service) => {
    const newStatus = !user.is_active;

    setData((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)),
    );

    setUpdatingId(user.id);

    try {
      const formData = new FormData();
      formData.append("ban", String(newStatus));

      await axios.put(
        `${apiUrl}/buyers/is-active-service/?id=${user.id}`,
        formData,
        {
          headers: {
            Authorization: getCookie("allianceToken"),
          },
        },
      );
    } catch (err) {
      setData((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_active: user.is_active } : u,
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    country_name: useDebounce(filters.country_name, 700),
    vendor_name: useDebounce(filters.vendor_name, 700),
    service_name: useDebounce(filters.service_name, 700),
    transport_mode: useDebounce(filters.transport_mode, 700),
    from_name: useDebounce(filters.from_name, 700),
    to_name: useDebounce(filters.to_name, 700),
    from_country: useDebounce(filters.from_country, 700),
    to_country: useDebounce(filters.to_country, 700),
    transport_type: useDebounce(filters.transport_type, 700),
    is_active: filters.is_active,
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

  const handleStatusFilter = (value: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, is_active: value }));
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

      {auth.role === "admin" && (
        <div className={styles.balance}>
          <div className={styles.rolesWrapper}>
            <button
              className={`${styles.roleButton} ${
                filters.is_active === undefined ? styles.activeRole : ""
              }`}
              onClick={() => handleStatusFilter(undefined)}
            >
              All
            </button>

            <button
              className={`${styles.roleButton} ${
                filters.is_active === true ? styles.activeRole : ""
              }`}
              onClick={() => handleStatusFilter(true)}
            >
              Deactive
            </button>

            <button
              className={`${styles.roleButton} ${
                filters.is_active === false ? styles.activeRole : ""
              }`}
              onClick={() => handleStatusFilter(false)}
            >
              Active
            </button>
          </div>
        </div>
      )}

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Country" },
            { name: "Vendor" },
            { name: "Service" },
            { name: "Transport Mode" },
            { name: "From" },
            { name: "To" },
            { name: "From Country" },
            { name: "To Country" },
            { name: "Transport Type" },
            { name: "Purchase Price Per Unity" },
            { name: "Purchase Price Per Ton" },
            { name: "Contract File" },
            { name: "Contract Date" },
            { name: "Protocol" },
            { name: "Protocol Date" },
            ...(auth.role === "admin" ? [{ name: "Services Status" }] : []),
            { name: "Edit" },
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
              {auth.role === "admin" && <td></td>}
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
              <td>{item.from_country}</td>
              <td>{item.to_country}</td>
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
              {auth.role === "admin" && (
                <td>
                  <div
                    className={`${styles.toggle} ${
                      item.is_active ? styles.inactive : styles.active
                    } ${updatingId === item.id ? styles.disabled : ""}`}
                    onClick={() =>
                      updatingId ? null : handleToggleStatus(item)
                    }
                  >
                    <span />
                    <p>{item.is_active ? "Inactive" : "Active"}</p>
                  </div>
                </td>
              )}
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() => {
                      setSelectedId(item.id);
                      setModal({ type: "edit" });
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
      {modal?.type === "edit" && (
        <EditServices
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

export default Services;
