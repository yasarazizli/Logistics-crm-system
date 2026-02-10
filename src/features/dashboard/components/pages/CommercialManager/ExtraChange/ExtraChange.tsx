import { useContext, useEffect, useState } from "react";
import styles from "../../Controls/HsCode/HsCode.module.scss";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import { useDebounce } from "@/hooks/useDebounce";
import { PenIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import CreateStation from "@/features/dashboard/components/shared/Modals/Station/CreateStation.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { getAllExtraChange } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import Button from "@/components/Button/Button.tsx";
import ExtraChangeModal from "@/features/dashboard/components/shared/Modals/CommercialManager/ExtraChangeModal.tsx";
// import ExtraChangeUpdate from "@/features/dashboard/components/shared/Modals/CommercialManager/ExtraChangeUpdate.tsx";

const filterKeys = [
  "order_no",
  "service",
  "total_quantity",
  "purchase_price_per_ton",
  "purchase_price_per_unit",
  "unit",
  "total_purchase_price",
  "selling_price",
  "total_selling_price",
  "vat",
  "profit",
  "vendor",
  "description",
] as const;

interface ExtraChangeProps {
  order_id: number;
  order_no: number;
  service: string;
  total_quantity: string;
  purchase_price_per_ton: string;
  purchase_price_per_unit: string;
  unit: string;
  total_purchase_price: string;
  selling_price: string;
  total_selling_price: string;
  vat: string;
  vat_18: boolean;
  profit: string;
  vendor: string;
  description: string;
  file: File | null;
  fileName: string;
}

const ExtraChange = () => {
  const { setLoader } = useContext(LoaderContext);

  const [filters, setFilters] = useState({
    order_no: "",
    service: "",
    total_quantity: "",
    purchase_price_per_ton: "",
    purchase_price_per_unit: "",
    unit: "",
    total_purchase_price: "",
    selling_price: "",
    total_selling_price: "",
    vat: "",
    profit: "",
    vendor: "",
    description: "",
  });

  const [modal, setModal] = useState<
    null | "create" | "accountant" | "extra_change" | "update"
  >(null);
  const [data, setData] = useState<ExtraChangeProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const debouncedFilters = {
    order_no: useDebounce(filters.order_no, 700),
    service: useDebounce(filters.service, 700),
    total_quantity: useDebounce(filters.total_quantity, 700),
    purchase_price_per_ton: useDebounce(filters.purchase_price_per_ton, 700),
    purchase_price_per_unit: useDebounce(filters.purchase_price_per_unit, 700),
    unit: useDebounce(filters.unit, 700),
    total_purchase_price: useDebounce(filters.total_purchase_price, 700),
    selling_price: useDebounce(filters.selling_price, 700),
    total_selling_price: useDebounce(filters.total_selling_price, 700),
    vat: useDebounce(filters.vat, 700),
    profit: useDebounce(filters.profit, 700),
    vendor: useDebounce(filters.vendor, 700),
    description: useDebounce(filters.description, 700),
  };

  const [pageHelper, setPageHelper] = useState({ render: false });

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      const response = await getAllExtraChange({
        ...debouncedFilters,
        page,
        pageSize,
      });
      if (response?.status === 200) {
        console.log(response?.data || []);
        setData(response.data || []);
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

  const [selectedId, setSelectedId] = useState<number | null>(null);

  console.log(selectedId);
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
            { name: "Order No" },
            { name: "Service" },
            { name: "Total quantity" },
            { name: "Purchase Price per Ton" },
            { name: "Purchase Price per Unit" },
            { name: "Unit" },
            { name: "Total Purchase Price" },
            { name: "Selling price" },
            { name: "Total Selling Price" },
            { name: "Vat" },
            { name: "Profit" },
            { name: "Vendor" },
            { name: "Description" },
            { name: "VAT 18%" },
            { name: "Action" },
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
            <tr key={item.order_id}>
              <td>{item.order_no}</td>
              <td>{item.service}</td>
              <td>{item.total_quantity}</td>
              <td>{item.purchase_price_per_ton}</td>
              <td>{item.purchase_price_per_unit}</td>
              <td>{item.unit}</td>
              <td>{item.total_purchase_price}</td>
              <td>{item.selling_price}</td>
              <td>{item.total_selling_price}</td>
              <td>{item.vat}</td>
              <td>{item.profit}</td>
              <td>{item.vendor}</td>
              <td>{item.description}</td>
              <td>
                <input type="checkbox" checked={item.vat_18} readOnly />
              </td>
              <td>
                <div className={styles.icon}>
                  <div
                    className={styles.icon__2}
                    onClick={() => setSelectedId(item.order_id)}
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

      {modal === "extra_change" && (
        <ExtraChangeModal
          modalClose={() => {
            setModal(null);
            setPageHelper((prev) => ({ ...prev, render: !prev.render }));
          }}
        />
      )}

      {/*{modal === "update" && (*/}
      {/*  <ExtraChangeUpdate*/}
      {/*    modalClose={() => {*/}
      {/*      setModal(null);*/}
      {/*      setPageHelper((prev) => ({ ...prev, render: !prev.render }));*/}
      {/*    }}*/}
      {/*    extraChangeId={selectedId}*/}
      {/*  />*/}
      {/*)}*/}
    </div>
  );
};

export default ExtraChange;
