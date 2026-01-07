import { useState, useEffect, useContext } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import Button from "@/components/Button/Button.tsx";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import Pagination from "@/features/dashboard/components/shared/Pagination/Pagination.tsx";
import { getAllServices } from "@/features/dashboard/services/Services&Vendor/all.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { SharedIcon } from "@/assets/icons/shared.vectors.tsx";

interface Service {
  id: number;
  country: string;
  location: string;
  vendor: string;
  service: string;
  transport_mode: string;
  hs_code: string;
  from: string;
  to: string;
  transport_type: string;
  purchase_price_ton: number;
  purchase_price_unit: number;
}

interface ServiceFilters {
  country_name: string;
  location: string;
  vendor_name: string;
  service_name: string;
  transport_mode: string;
  hs_code_name: string;
  from_name: string;
  to_name: string;
  transport_type: string;
}

const CreateServicesTable = ({
  modalClose,
  onServiceSelect,
}: {
  modalClose: (isRender: boolean) => void;
  onServiceSelect: (service: Service) => void;
}) => {
  const { setLoader } = useContext(LoaderContext);

  const [data, setData] = useState<Service[]>([]);
  const [filters, setFilters] = useState<ServiceFilters>({
    country_name: "",
    location: "",
    vendor_name: "",
    service_name: "",
    transport_mode: "",
    hs_code_name: "",
    from_name: "",
    to_name: "",
    transport_type: "",
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedFilters = {
    country_name: useDebounce(filters.country_name, 500),
    location: useDebounce(filters.location, 500),
    vendor_name: useDebounce(filters.vendor_name, 500),
    service_name: useDebounce(filters.service_name, 500),
    transport_mode: useDebounce(filters.transport_mode, 500),
    hs_code_name: useDebounce(filters.hs_code_name, 500),
    from_name: useDebounce(filters.from_name, 500),
    to_name: useDebounce(filters.to_name, 500),
    transport_type: useDebounce(filters.transport_type, 500),
  };

  const filterLabels: Record<keyof ServiceFilters, string> = {
    country_name: "Country",
    location: "Location",
    vendor_name: "Vendor",
    service_name: "Service",
    transport_mode: "Transport Mode",
    hs_code_name: "HS Code",
    from_name: "From",
    to_name: "To",
    transport_type: "Transport Type",
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service);
    modalClose(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const response = await getAllServices({
          ...debouncedFilters,
          page,
          pageSize,
        });

        if (response?.status === 200) {
          setData(response.data?.data || []);
          const totalCount = response.data?.count || 0;
          setTotalPages(Math.ceil(totalCount / pageSize));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, [page, pageSize, ...Object.values(debouncedFilters)]);

  return (
    <Modal title="Services Table" modalClose={() => modalClose(false)}>
      <Table
        headers={[
          { name: "Country" },
          { name: "Location" },
          { name: "Vendor" },
          { name: "Service" },
          { name: "Transport Mode" },
          { name: "HS Code" },
          { name: "From" },
          { name: "To" },
          { name: "Transport Type" },
          { name: "Action" },
        ]}
        filters={
          <>
            {Object.keys(filters).map((key) => (
              <td key={key}>
                <input
                  placeholder={`Filter by ${filterLabels[key as keyof ServiceFilters]}`}
                  value={filters[key as keyof ServiceFilters]}
                  onChange={(e) =>
                    handleFilterChange(
                      key as keyof ServiceFilters,
                      e.target.value,
                    )
                  }
                />
              </td>
            ))}
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
            <td>{item.hs_code}</td>
            <td>{item.from}</td>
            <td>{item.to}</td>
            <td>{item.transport_type}</td>
            <td>
              <div
                className={styles.action}
                onClick={() => handleServiceSelect(item)}
              >
                <p>Select offer</p>
                <SharedIcon />
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

      <div className={styles.form__buttons}>
        <Button text="Cancel" type="button" onClick={() => modalClose(false)} />
      </div>
    </Modal>
  );
};

export default CreateServicesTable;
