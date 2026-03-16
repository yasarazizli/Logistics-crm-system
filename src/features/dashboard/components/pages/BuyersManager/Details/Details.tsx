import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import Input from "@/components/Input/Input.tsx";
import { useEffect, useState, useRef, useCallback } from "react";
import GetPackagingForm from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import { useLocation } from "react-router-dom";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";
import GetSelectList from "@/features/dashboard/components/shared/GetSelectList/GetSelectList.tsx";
import {
  QuotationData,
  GetOffer,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import Table, {
  TableRowData,
  TableSummaryData,
} from "@/features/dashboard/components/shared/GetRowTable/DetailsTable/DetailsTable.tsx";
import GetDynamicForm, {
  DynamicFormRef,
} from "@/features/dashboard/components/shared/GetDynamicForm/GetDynamicForm.tsx";

interface OfferData {
  tableData: TableRowData[];
  summary: TableSummaryData;
  note: string;
  shipmentData?: any;
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
    id: number;
    shipper: string;
    shipper_required: boolean;
    consignee: string;
    consignee_required: boolean;
    notify_party: number;
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

const Details = () => {
  const location = useLocation();
  const order = location.state?.order;

  const dynamicFormRefs = useRef<Map<number, DynamicFormRef>>(new Map());
  const [offers, setOffers] = useState<OfferData[]>([]);

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  const setDynamicFormRef = useCallback(
    (index: number, ref: DynamicFormRef | null) => {
      if (ref) {
        dynamicFormRefs.current.set(index, ref);

        const offer = offers[index];
        if (offer?.shipmentData) {
          setTimeout(() => {
            ref.setFormData(offer.shipmentData);
          }, 100);
        }
      } else {
        dynamicFormRefs.current.delete(index);
      }
    },
    [offers],
  );

  const convertToISO = useCallback((dateStr?: string) => {
    if (!dateStr) return "";

    if (dateStr.includes("-")) {
      return dateStr;
    }

    const parts = dateStr.split(".");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const formattedMonth = month.padStart(2, "0");
      const formattedDay = day.padStart(2, "0");
      return `${year}-${formattedMonth}-${formattedDay}`;
    }

    return "";
  }, []);

  const [notes, setNotes] = useState<
    Array<{
      name: string;
      role: string;
      date: string;
      note: string;
    }>
  >([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;

          if (apiData) {
            setTotalWeight(apiData.total_weight?.toString() || "");

            const formattedStartDate = convertToISO(apiData.start_date);
            const formattedEndDate = convertToISO(apiData.end_date);

            setStartDate(formattedStartDate);
            setEndDate(formattedEndDate);
          }

          if (apiData.note) {
            try {
              if (typeof apiData.note === "string") {
                const parsed = JSON.parse(apiData.note);
                setNotes(Array.isArray(parsed) ? parsed : [parsed]);
              } else if (Array.isArray(apiData.note)) {
                setNotes(apiData.note);
              } else if (typeof apiData.note === "object") {
                setNotes([apiData.note]);
              }
            } catch (e) {
              console.error("Error parsing notes:", e);
              setNotes([
                {
                  name: "System",
                  role: "system",
                  date: new Date().toISOString(),
                  note:
                    typeof apiData.note === "string"
                      ? apiData.note
                      : "Invalid note format",
                },
              ]);
            }
          } else {
            setNotes([]);
          }
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };

    if (order?.order_id) {
      fetchRequest();
    }
  }, [order, convertToISO]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await GetOffer(order.order_id);
        if (response?.status === 200) {
          const apiData = response.data;

          if (apiData && Array.isArray(apiData)) {
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
                  purchasePricePerTonAlis:
                    service.purchase_price_per_ton?.toString() || "",
                  purchasePricePerUnitAlis:
                    service.purchase_price_per_unit?.toString() || "",
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

              const shipmentData = offer.shipment
                ? {
                    shipper: offer.shipment.shipper || "",
                    consignee: offer.shipment.consignee || "",
                    notify_party: offer.shipment.notify_party,
                    terminal: offer.shipment.terminal || "",
                    container_owner: offer.shipment.container_owner || "",
                    wagon_owner: offer.shipment.wagon_owner || "",
                    notify_party_required:
                      offer.shipment.notify_party_required || false,
                    terminal_required:
                      offer.shipment.terminal_required || false,
                    container_owner_required:
                      offer.shipment.container_owner_required || false,
                    wagon_owner_required:
                      offer.shipment.wagon_owner_required || false,
                    container_no: offer.shipment.container_no || "",
                    container_drop_off: offer.shipment.container_drop_off || "",
                    wagon_no: offer.shipment.wagon_no || "",
                    wagon_drop_off: offer.shipment.wagon_drop_off || "",
                    container_no_required:
                      offer.shipment.container_no_required || false,
                    container_drop_off_required:
                      offer.shipment.container_drop_off_required || false,
                    wagon_no_required:
                      offer.shipment.wagon_no_required || false,
                    wagon_drop_off_required:
                      offer.shipment.wagon_drop_off_required || false,
                  }
                : null;

              return {
                tableData,
                summary,
                note: offer.note || "",
                shipmentData: shipmentData,
              };
            });

            setOffers(formattedOffers);
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

  useEffect(() => {
    if (offers.length > 0) {
      offers.forEach((offer, index) => {
        const ref = dynamicFormRefs.current.get(index);
        if (ref && offer.shipmentData) {
          setTimeout(() => {
            ref.setFormData(offer.shipmentData);
          }, 200);
        }
      });
    }
  }, [offers]);

  return (
    <div className={`${styles.price__quotation} ${styles.readOnly}`}>
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <h1 className={styles.title}>Order</h1>
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
              />
            </div>
          </div>
        </div>

        <div className={styles.expendable}>
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
        </div>

        <GetPackagingForm
          onDataChange={() => {}}
          onRoutesChange={() => {}}
          onStackableChange={() => {}}
          onInRowChange={() => {}}
          onContainerProvisionChange={() => {}}
          onWagonProvisionChange={() => {}}
          onTransportationTypeChange={() => {}}
          onWagonTypeChange={() => {}}
        />

        {offers.map((offer: OfferData, index: number) => (
          <div key={index} style={{ marginBottom: "24px" }}>
            <h1 className={styles.offer__title}>
              Commercial Offer - {index + 1}
            </h1>
            <div className={styles.commercial}>
              <Table
                index={index}
                rows={offer.tableData}
                summary={offer.summary}
                onTableDataChange={() => {}}
                onDeleteService={() => {}}
                onServiceSelect={() => {}}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <GetDynamicForm
                ref={(ref: DynamicFormRef | null) =>
                  setDynamicFormRef(index, ref)
                }
              />
            </div>
          </div>
        ))}

        <div>
          <h1 className={styles.period}>Transport Period</h1>
          <div className={styles.date}>
            <Input
              type="date"
              label="Start Date"
              red="*"
              style={{ height: "52px" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              red="*"
              style={{ height: "52px" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.note}>
          <label className={styles.label}>Note</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Your note here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {notes.length > 0 && (
            <div className={styles.notesList}>
              <h3>Previous Notes:</h3>
              {notes.map((item, index) => (
                <div key={index} className={styles.noteItem}>
                  <div className={styles.noteHeader}>
                    <strong>{item.name}</strong>
                    <span className={styles.role}>({item.role})</span>
                    <span className={styles.date}>
                      {new Date(item.date).toLocaleString()}
                    </span>
                  </div>
                  <p className={styles.noteContent}>{item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
