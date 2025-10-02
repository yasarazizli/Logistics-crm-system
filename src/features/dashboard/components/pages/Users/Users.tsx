import { useContext, useEffect, useRef, useState } from "react";
import styles from "../Controls/HsCode/HsCode.module.scss";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FileIcon,
  GreenAddIcon,
  PenIcon,
  YellowPlusIcon,
} from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useTranslation } from "react-i18next";
import { checkRequest } from "@/features/auth/services/auth.service.ts";
import AddBalance from "@/features/dashboard/components/shared/Modals/Users/AddBalance.tsx";
import AddContract from "@/features/dashboard/components/shared/Modals/Users/AddContract.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { useNavigate } from "react-router-dom";
import i18n from "@/locales/i18n.ts";
import { getAllOrder } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

const filterKeys = [
  "order_code",
  "country_loading",
  "country_destination",
  "start_date",
  "end_date",
] as const;

const Users = () => {
  const navigate = useNavigate();
  const dataRef = useRef<any>(null);
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    order_code: "",
    country_loading: "",
    country_destination: "",
    start_date: "",
    end_date: "",
    status: "",
  });

  const [modal, setModal] = useState<
    null | { type: "add" } | { type: "contract"; id: number }
  >(null);

  const [pageHelper, setPageHelper] = useState({ render: false });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    order_code: useDebounce(filters.order_code, 700),
    country_loading: useDebounce(filters.country_loading, 700),
    country_destination: useDebounce(filters.country_destination, 700),
    start_date: useDebounce(filters.start_date, 700),
    end_date: useDebounce(filters.end_date, 700),
  };

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllOrder({
        ...debouncedFilters,
        status: filters.status,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        console.log("data", response.data);
        setData(response.data?.data || []);
        setTotal(response.data?.count || 0);
      }
    };
    fetchData();
    setLoader(false);
  }, [
    page,
    pageHelper.render,
    filters.status,
    ...Object.values(debouncedFilters),
  ]);

  useEffect(() => {
    setLoader(true);
    const checkData = async () => {
      const response = await checkRequest();
      if (response?.status === 200) {
        console.log("checkData", response.data);
        dataRef.current = response.data;
      }
    };
    checkData();
    setLoader(false);
  }, []);

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

  const addModal = modal?.type === "add" && (
    <AddBalance
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const addContract = modal?.type === "contract" && (
    <AddContract
      id={modal.id}
      modalClose={() => {
        setModal(null);
        setPageHelper((prev) => ({ ...prev, render: !prev.render }));
      }}
    />
  );

  const totalPages = Math.ceil(total / pageSize);

  const status = [
    "pending",
    "offered",
    "ordered",
    "completed",
    "draft",
    "rejected",
  ];

  const statusColors: Record<string, string> = {
    pending: "#F5E233",
    offered: "#F5E233",
    ordered: "#1D7321",
    completed: "#1D7321",
    draft: "#808080",
    rejected: "#F74156",
  };

  const goToQuotation = () => {
    navigate(`/${i18n.language}/auth/price/quotation`, {
      state: { showShipper: true },
    });
  };

  const handleClickEdit = (orderId: number) => {
    const selectedOrder = data.find((item) => item.order_id === orderId);
    navigate(`/${i18n.language}/user/offer/confirmation`, {
      state: { order: selectedOrder },
    });
  };

  return (
    <div className={styles.hscode}>
      <div className={styles.title__btn}>
        <h1>Users</h1>
      </div>

      <div className={styles.balance}>
        <div className={styles.rolesWrapper}>
          {status.map((stat) => (
            <button
              key={stat}
              onClick={() => {
                setFilters((prev) => ({ ...prev, status: stat }));
                setPage(1);
              }}
              className={`${styles.statusButton} ${
                filters.status === stat ? styles.activeStatus : ""
              }`}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  backgroundColor: statusColors[stat],
                }}
              />
              {t(`workers.status.${stat}`)}
            </button>
          ))}
        </div>
        <div className={styles.btn}>
          <div
            className={styles.status}
            onClick={() =>
              setModal({ type: "contract", id: dataRef.current.id })
            }
          >
            <p>
              {t("workers.status.contract")}
              {dataRef.current?.contract_status}
              <GreenAddIcon />
            </p>
          </div>
          <div
            className={styles.price}
            onClick={() => setModal({ type: "add" })}
          >
            <YellowPlusIcon />
            <p>
              {t("workers.status.price")}
              {dataRef.current?.balance} AZN
            </p>
          </div>
          <Button
            text="Ask Quotation"
            viewType="green__light"
            onClick={goToQuotation}
          />
        </div>
      </div>

      <div className={styles.table}>
        <Table
          headers={[
            { name: "Order code" },
            { name: "Country of loading" },
            { name: "Country of destination" },
            { name: "Start Date" },
            { name: "End Date" },
            { name: "Status" },
            { name: "Invoice document" },
            { name: "Instruction document" },
            { name: "Istifadəçi təsdiqi" },
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
              <td></td>
            </>
          }
        >
          {data.map((item) => (
            <tr key={item.order_id}>
              <td>{item.order_id}</td>
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
                    className={styles.icon__2}
                    onClick={() => handleClickEdit(item.order_id)}
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

      {addContract}
      {addModal}
    </div>
  );
};

export default Users;
