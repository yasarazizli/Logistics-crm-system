import { useContext, useEffect, useState } from "react";
import styles from "../../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import CreateStation from "@/features/dashboard/components/shared/Modals/Station/CreateStation.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { getAllOrder } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import Button from "@/components/Button/Button.tsx";
import ExtraChangeModal from "@/features/dashboard/components/shared/Modals/CommercialManager/ExtraChangeModal.tsx";

const filterKeys = [
  "order_code",
  "customer",
  "phone_number",
  "email",
  "country_loading",
  "country_destination",
  "start_date",
  "end_date",
  "status",
] as const;

interface ExtraChangeProps {
  order_id: number;
  chose_member: string;
  country_destination: string;
  country_loading: string;
  customer: string;
  start_date: string;
  end_date: string;
  email: string;
  order_type: string;
  instructions: string;
  invoice: string;
  phone_number: string;
  status: string;
  price?: string | number;
}

const ExtraChange = () => {
  const { setLoader } = useContext(LoaderContext);

  const [filters, setFilters] = useState({
    order_code: "",
    customer: "",
    phone_number: "",
    email: "",
    country_loading: "",
    country_destination: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const [modal, setModal] = useState<
    null | "create" | "accountant" | "extra_change"
  >(null);
  const [data, setData] = useState<ExtraChangeProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    order_code: useDebounce(filters.order_code, 700),
    customer: useDebounce(filters.customer, 700),
    phone_number: useDebounce(filters.phone_number, 700),
    email: useDebounce(filters.email, 700),
    country_loading: useDebounce(filters.country_loading, 700),
    country_destination: useDebounce(filters.country_destination, 700),
    status: useDebounce(filters.status, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  const [pageHelper, setPageHelper] = useState({ render: false });

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllOrder({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Extra Change</h1>
        <Button
          text="Extra Change"
          viewType="green__light"
          icon={PlusIcon}
          onClick={() => setModal("extra_change")}
        />
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Service" },
            { name: "Total quantity" },
            { name: "Purchase Price per Ton" },
            { name: "Purchase Price per Unit" },
            { name: "Unit" },
            { name: "Total Purchase Price" },
            { name: "Selling price" },
            { name: "Total Selling Price" },
            { name: "VAT 18%" },
            { name: "Profit" },
            { name: "Vendor" },
            { name: "Description" },
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
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.order_id}>
              <td>{item.order_id}</td>
              <td>{item.customer}</td>
              <td>{item.phone_number}</td>
              <td>{item.email}</td>
              <td>{item.country_loading}</td>
              <td>{item.country_destination}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>{item.status}</td>
              <td>
                {item.invoice ? (
                  <a
                    href={item.invoice}
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
              </td>
              <td>
                {item.instructions ? (
                  <a
                    href={item.instructions}
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
              </td>

              <td></td>
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pg) => setPage(pg)}
        />
      </div>

      {modal === "create" && (
        <CreateStation
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}

      {modal === "extra_change" && (
        <ExtraChangeModal
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}
    </div>
  );
};

export default ExtraChange;
