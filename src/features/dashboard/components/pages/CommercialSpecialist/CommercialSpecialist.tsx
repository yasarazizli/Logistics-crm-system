import { useContext, useEffect, useState } from "react";
import styles from "../../pages/Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { FileIcon, PenIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import CreateStation from "@/features/dashboard/components/shared/Modals/Station/CreateStation.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { getAllOrder } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import i18n from "@/locales/i18n.ts";
import { useNavigate } from "react-router-dom";
import { AddIconTable, CrossIcon } from "@/assets/icons/order.vectors.tsx";

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

interface Order {
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

const CommercialSpecialist = () => {
  const navigate = useNavigate();
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

  const [modal, setModal] = useState<null | "create" | "accountant">(null);
  const [data, setData] = useState<Order[]>([]);
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

  const handleClickEdit = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/commercial/manager/information`, {
      state: { order: selectedOrder },
    });
  };

  const handleClickEdit_2 = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/commercial/manager/information/edit`, {
      state: { order: selectedOrder },
    });
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Order</h1>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Order Code" },
            { name: "Customer" },
            { name: "Phone number" },
            { name: "Email address" },
            { name: "Country of loading" },
            { name: "Country of destination" },
            { name: "Start Date" },
            { name: "End Date" },
            { name: "Status" },
            { name: "Invoice document" },
            { name: "Instruction document" },
            { name: "Add Offer" },
            { name: "Edit" },
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
              <td>
                <div className={styles.icon}>
                  <div
                    className={`${styles.icon__2} ${
                      item.order_type === "RegisterPriceQuotation"
                        ? styles.disabled
                        : ""
                    }`}
                    onClick={() => {
                      if (item.order_type !== "RegisterPriceQuotation") {
                        handleClickEdit(item.order_id);
                      }
                    }}
                  >
                    {item.order_type === "RegisterPriceQuotation" ? (
                      <CrossIcon />
                    ) : (
                      <AddIconTable />
                    )}
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() => handleClickEdit_2(item.order_id)}
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

      {modal === "create" && (
        <CreateStation
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}
    </div>
  );
};

export default CommercialSpecialist;
