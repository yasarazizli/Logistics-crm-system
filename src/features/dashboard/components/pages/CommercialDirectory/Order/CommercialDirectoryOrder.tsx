import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import Input from "@/components/Input/Input.tsx";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import Button from "@/components/Button/Button.tsx";
import { toast } from "react-toastify";
import InputSection from "@/features/dashboard/components/shared/InputSection/InputSection.tsx";
import Table, {
  CompleteTableData,
  TableRowData,
  TableSummaryData,
} from "@/features/dashboard/components/shared/GetRowTable/GetRowTable.tsx";
import GetDynamicForm, {
  DynamicFormRef,
} from "@/features/dashboard/components/shared/GetDynamicForm/GetDynamicForm.tsx";
import { PdfIcon } from "@/assets/icons/shared.vectors.tsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";
import GetSelectList from "@/features/dashboard/components/shared/GetSelectList/GetSelectList.tsx";
import {
  QuotationData,
  UserData,
  GetOffer,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import GetPackagingForm, {
  PackagingData,
  RouteData,
} from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import { getCookie } from "@/libs/cookie.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { errorMessageHandler } from "@/libs/error.ts";
import i18n from "@/locales/i18n.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

interface OfferData {
  tableData: TableRowData[];
  summary: TableSummaryData;
  note: string;
}

interface ApiOfferData {
  id: number;
  is_agree: boolean;
  note: string;
  amount: number;
  vat: number;
  total_amount: number;
  per_ton_price: number;
  transportation_time: number;
  service: Array<{
    id: number;
    service_id: number;
    name_of_service: string;
    location: string;
    transport_mode: string;
    from: string;
    to: string;
    transport_type: string;
    payload: number;
    total_quantity: number;
    estimated_transport_time: number;
    purchase_price_per_ton: number;
    purchase_price_per_unit: number;
    unit: string;
    total_purchase_price: number;
    selling_price: number;
    total_selling_price: number;
    vat_amount: number;
    vat_18: boolean;
    profit: number;
    vendor: string;
    note: string;
    packing: {
      id: number;
      packing_type: string;
      size: number;
      package_type: string;
      total_quantity: number;
      net_weight: number;
      gross_weight: number;
      width: number;
      height: number;
      length: number;
    };
  }>;
  shipment: {
    shipper: string;
    shipper_required: boolean;
    consignee: string;
    consignee_required: boolean;
    notify_party: number | null;
    notify_party_required: boolean;
    terminal: string;
    terminal_required: boolean;
    container_owner: string;
    container_owner_required: boolean;
    wagon_owner: string;
    wagon_owner_required: boolean;
    container_no: string;
    container_no_required: boolean;
    container_drop_off: string;
    container_drop_off_required: boolean;
    wagon_no: string;
    wagon_no_required: boolean;
    wagon_drop_off: string;
    wagon_drop_off_required: boolean;
  };
}

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

const DirectoryOrder = () => {
  const { setLoader } = useContext(LoaderContext);
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const dynamicFormRefs = useRef<Map<number, DynamicFormRef>>(new Map());
  const [apiData, setApiData] = useState<ApiOfferData[]>([]);
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: { value: string; label: string };
  }>({});

  const [selectedCargo, setSelectedCargo] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [selectedCode, setSelectedCode] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [totalWeight, setTotalWeight] = useState<string>("");

  const [unCode, setUnCode] = useState("");
  const [msDs, setMsDs] = useState<File | null>(null);
  const [msDsPictures, setMsDsPictures] = useState<File[]>([]);
  const [dangerous, setDangerous] = useState(false);

  const [packagingData, setPackagingData] = useState<PackagingData>({
    package_type: "Container",
    total_quantity: 0,
    net_weight: 0,
    gross_weight: 0,
  });

  const [stackable, setStackable] = useState(false);
  const [inRow, setInRow] = useState(0);
  const [requestContainerProvision, setRequestContainerProvision] =
    useState(false);
  const [requestWagonProvision, setRequestWagonProvision] = useState(false);
  const [transportationType, setTransportationType] = useState<string>("Rail");
  const [wagonType, setWagonType] = useState<string>("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  const [routes, setRoutes] = useState<RouteData[]>([]);

  const [offers, setOffers] = useState<OfferData[]>([]);
  const [deletedServiceIds, setDeletedServiceIds] = useState<number[]>([]);

  const isRegister = order?.order_type === "RegisterPriceQuotation";

  const handleWagonTypeChange = useCallback((type: string) => {
    setWagonType(type);
  }, []);

  const handlePackagingDataChange = useCallback((data: PackagingData) => {
    setPackagingData(data);
  }, []);

  const handleRoutesChange = useCallback((newRoutes: RouteData[]) => {
    setRoutes(newRoutes);
  }, []);

  const handleTransportationTypeChange = useCallback((type: string) => {
    setTransportationType(type);
  }, []);

  const handleStackableChange = useCallback((value: boolean) => {
    setStackable(value);
  }, []);

  const handleInRowChange = useCallback((value: number) => {
    setInRow(value);
  }, []);

  const handleContainerProvisionChange = useCallback((value: boolean) => {
    setRequestContainerProvision(value);
  }, []);

  const handleWagonProvisionChange = useCallback((value: boolean) => {
    setRequestWagonProvision(value);
  }, []);

  const handleExtraChange = useCallback((name: string, value: string) => {
    setExtraInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleOfferNoteChange = useCallback((index: number, note: string) => {
    setOffers((prev) =>
      prev.map((offer, i) => (i === index ? { ...offer, note } : offer)),
    );
  }, []);

  const handleDeleteService = useCallback(
    (offerIndex: number, deletedIds: number[]) => {
      setDeletedServiceIds((prev) => [...prev, ...deletedIds]);

      setOffers((prev) =>
        prev.map((offer, i) =>
          i === offerIndex
            ? {
                ...offer,
                tableData: offer.tableData.filter(
                  (row) => !deletedIds.includes(row.id || 0),
                ),
              }
            : offer,
        ),
      );
    },
    [],
  );

  const setDynamicFormRef = useCallback(
    (index: number, ref: DynamicFormRef | null) => {
      if (ref) {
        dynamicFormRefs.current.set(index, ref);
      } else {
        dynamicFormRefs.current.delete(index);
      }
    },
    [],
  );

  const handleServiceSelect = useCallback(
    (offerIndex: number, rowIndex: number, service: Service) => {
      setSelectedServices((prev) => ({
        ...prev,
        [`${offerIndex}-${rowIndex}`]: {
          value: service.id.toString(),
          label: service.service,
        },
      }));
    },
    [],
  );

  const pageRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadFullPDF = useCallback(async () => {
    if (!pageRef.current) return;

    const element = pageRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let position = 0;
    let heightLeft = pdfHeight;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save("Full_Page.pdf");
  }, []);

  const handleSubmit = useCallback(
    async (status: "reject" | "send") => {
      setLoader(true);

      const formData = new FormData();
      formData.append("order_quotation", order.order_id);
      formData.append("btn_status", status);

      try {
        const response = await axios.put(
          `${apiUrl}/commercial/approved-director/?order_id=${order.order_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: getCookie("allianceToken"),
            },
          },
        );

        if (response?.status === 200 || response?.status === 201) {
          toast.success(errorMessageHandler(response.data));
          if (response?.status === 200) {
            navigate(`/${i18n.language}/commercial/director/orders`);
          }
        } else {
          toast.error(errorMessageHandler(response.data));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred while submitting the form");
      } finally {
        setLoader(false);
      }
    },
    [
      selectedCode,
      totalWeight,
      unCode,
      dangerous,
      packagingData,
      stackable,
      requestContainerProvision,
      requestWagonProvision,
      inRow,
      startDate,
      endDate,
      note,
      routes,
      transportationType,
      wagonType,
      offers,
      msDs,
      msDsPictures,
      order,
      apiData,
      deletedServiceIds,
      selectedServices,
      setLoader,
      navigate,
    ],
  );

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;

          if (apiData) {
            setStartDate(apiData.start_date ?? "");
            setEndDate(apiData.end_date ?? "");
            setNote(apiData.not);
            setTotalWeight(apiData.total_weight?.toString() || "");
          }
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };

    fetchRequest();
  }, [order]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await GetOffer(order.order_id);
        if (response?.status === 200) {
          const apiData = response.data;

          if (apiData && Array.isArray(apiData)) {
            setApiData(apiData);

            const formattedOffers = apiData.map((offer: ApiOfferData) => {
              const tableData: TableRowData[] =
                offer.service?.map((service) => ({
                  id: service.id,
                  serviceName: service.name_of_service?.toString() || "",
                  location: service.location || "",
                  transportMode: service.transport_mode || "",
                  from: service.from || "",
                  to: service.to || "",
                  transportType: service.transport_type || "",
                  packagingType: service.packing?.packing_type || "",
                  packagingSize: service.packing?.size?.toString() || "",
                  packagingPackage: service.packing?.package_type || "",
                  netWeight: service.packing?.net_weight?.toString() || "",
                  grossWeight: service.packing?.gross_weight?.toString() || "",
                  width: service.packing?.width?.toString() || "",
                  length: service.packing?.length?.toString() || "",
                  height: service.packing?.height?.toString() || "",
                  payload: service.payload?.toString() || "",
                  totalQuantity: service.total_quantity?.toString() || "",
                  estimatedTime:
                    service.estimated_transport_time?.toString() || "",
                  purchasePricePerTon:
                    service.purchase_price_per_ton?.toString() || "",
                  purchasePricePerUnit:
                    service.purchase_price_per_unit?.toString() || "",
                  unit: service.unit || "",
                  totalPurchasePrice:
                    service.total_purchase_price?.toString() || "",
                  sellingPrice: service.selling_price?.toString() || "",
                  totalPrice: service.total_selling_price?.toString() || "",
                  vatAmount: service.vat_amount?.toString() || "",
                  vat18: service.vat_18 || false,
                  profit: service.profit?.toString() || "",
                  vendor: service.vendor || "",
                  note: service.note || "",
                })) || [];

              const summary: TableSummaryData = {
                amount: offer.amount?.toString() || "0",
                vat: offer.vat?.toString() || "0",
                totalAmount: offer.total_amount?.toString() || "0",
                perTonPrice: offer.per_ton_price?.toString() || "0",
                transportationTime:
                  offer.transportation_time?.toString() || "0",
              };

              return {
                tableData,
                summary,
                note: offer.note || "",
              };
            });

            setOffers(formattedOffers);

            const servicesFromApi: {
              [key: string]: { value: string; label: string };
            } = {};
            apiData.forEach((offer: ApiOfferData, offerIndex: number) => {
              offer.service?.forEach((service, rowIndex) => {
                if (service.service_id && service.name_of_service) {
                  const serviceKey = `${offerIndex}-${rowIndex}`;
                  servicesFromApi[serviceKey] = {
                    value: service.service_id.toString(),
                    label: service.name_of_service,
                  };
                }
              });
            });

            setSelectedServices((prev) => ({ ...prev, ...servicesFromApi }));

            setTimeout(() => {
              formattedOffers.forEach((_, index) => {
                const apiOffer = apiData[index];
                if (apiOffer && apiOffer.shipment) {
                  const dynamicFormRef = dynamicFormRefs.current.get(index);
                  if (dynamicFormRef) {
                    dynamicFormRef.setFormData(apiOffer.shipment);
                  }
                }
              });
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    if (order?.order_id) {
      fetchOffers();
    }
  }, [order]);

  const [extraInputs, setExtraInputs] = useState({
    field1: "",
    field2: "",
    field3: "",
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await UserData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;

          setExtraInputs({
            field1: apiData.full_name || "",
            field2: apiData.email || "",
            field3: apiData.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };

    fetchRequest();
  }, [order]);

  const handleTableDataChange = useCallback(
    (index: number, data: CompleteTableData) => {
      setOffers((prev) =>
        prev.map((offer, i) =>
          i === index
            ? { ...offer, tableData: data.rows, summary: data.summary }
            : offer,
        ),
      );
    },
    [],
  );

  const memoizedGetPackagingForm = useMemo(
    () => (
      <GetPackagingForm
        onDataChange={handlePackagingDataChange}
        onRoutesChange={handleRoutesChange}
        onStackableChange={handleStackableChange}
        onInRowChange={handleInRowChange}
        onContainerProvisionChange={handleContainerProvisionChange}
        onWagonProvisionChange={handleWagonProvisionChange}
        onTransportationTypeChange={handleTransportationTypeChange}
        onWagonTypeChange={handleWagonTypeChange}
      />
    ),
    [
      handlePackagingDataChange,
      handleRoutesChange,
      handleStackableChange,
      handleInRowChange,
      handleContainerProvisionChange,
      handleWagonProvisionChange,
      handleTransportationTypeChange,
      handleWagonTypeChange,
    ],
  );

  return (
    <div
      className={`${styles.price__quotation} ${styles.readOnly}`}
      ref={pageRef}
    >
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <InputSection
            inputs={[
              {
                name: "field1",
                label: "Full Name",
                placeholder: "Full Name",
                value: extraInputs.field1,
              },
              {
                name: "field2",
                label: "Email",
                placeholder: "Email",
                value: extraInputs.field2,
              },
              {
                name: "field3",
                label: "Phone number",
                placeholder: "+944-123-45-67",
                value: extraInputs.field3,
              },
            ]}
            onChange={handleExtraChange}
          />
          <div className={styles.input__list}>
            <GetSelectList
              selectedCargo={selectedCargo}
              setSelectedCargo={setSelectedCargo}
              selectedCode={selectedCode}
              setSelectedCode={setSelectedCode}
            />
            <div className={styles.input}>
              <Input
                label="Total Weight"
                placeholder="Weight"
                value={totalWeight}
                onChange={(e) => setTotalWeight(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <GetExpandableSection
          unCode={unCode}
          setUnCode={setUnCode}
          msDs={msDs}
          setMsDs={setMsDs}
          msDsPictures={msDsPictures}
          setMsDsPictures={setMsDsPictures}
          dangerous={dangerous}
          setDangerous={setDangerous}
        />

        {memoizedGetPackagingForm}

        <h1 className={styles.period}>Transport Period</h1>
        <div className={styles.date}>
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {offers.map((offer, index) => (
          <div key={index} style={{ marginBottom: "24px" }}>
            <h1 className={styles.offer__title}>
              Commercial Offer - {index + 1}
            </h1>
            <div className={styles.commercial}>
              <Table
                index={index}
                rows={offer.tableData}
                summary={offer.summary}
                onTableDataChange={handleTableDataChange}
                onDeleteService={(deletedIds) =>
                  handleDeleteService(index, deletedIds)
                }
                onServiceSelect={(service, colIndex) =>
                  handleServiceSelect(index, colIndex, service)
                }
              />

              <div style={{ width: "100%" }}>
                <Button
                  icon={PdfIcon}
                  text={`Download Commercial Offer ${index + 1}-PDF`}
                  viewType="green__light"
                  onClick={handleDownloadFullPDF}
                />
              </div>
              <Input
                label="Customer note"
                placeholder="Your note here"
                value={offer.note}
                onChange={(e) => handleOfferNoteChange(index, e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <GetDynamicForm
                ref={(ref: DynamicFormRef | null) =>
                  setDynamicFormRef(index, ref)
                }
                isRegister={isRegister}
              />
            </div>
          </div>
        ))}
        <div className={styles.note}>
          <label className={styles.label}>Note</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Your note here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className={styles.button}>
          <Button
            onClick={() => handleSubmit("reject")}
            text="Reject"
            viewType="red"
          />
          <Button
            onClick={() => handleSubmit("send")}
            text="Send offer to customer"
            viewType="dark-green"
          />
        </div>
      </div>
    </div>
  );
};

export default DirectoryOrder;
