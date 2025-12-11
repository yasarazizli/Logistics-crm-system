import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import axios from "axios";
import Button from "@/components/Button/Button.tsx";
import { toast } from "react-toastify";
import InputSection from "@/features/dashboard/components/shared/InputSection/InputSection.tsx";
import Table, {
  CompleteTableData,
  TableRowData,
  TableSummaryData,
} from "@/features/dashboard/components/shared/RowTable/RowTable.tsx";
import DynamicForm, {
  DynamicFormData,
} from "@/features/dashboard/components/shared/DynamicForm/DynamicForm.tsx";
import { PdfIcon, PlusIcon } from "@/assets/icons/shared.vectors.tsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";
import GetSelectList from "@/features/dashboard/components/shared/GetSelectList/GetSelectList.tsx";
import {
  QuotationData,
  UserData,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import GetPackagingForm from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import { getCookie } from "@/libs/cookie.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { errorMessageHandler } from "@/libs/error.ts";
import i18n from "@/locales/i18n.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

interface QuotationType {
  total_weight: number;
  packing: {
    start_date: string;
    end_date: string;
  };
  rows: TableRowData[];
  summary: TableSummaryData;
}

interface OfferData {
  tableData: TableRowData[];
  summary: TableSummaryData;
  note: string;
  rows: TableRowData[];
  initialRows: TableRowData[];
}

interface DynamicFormRef {
  getFormData: () => DynamicFormData;
}

const CustomerInformation = () => {
  const { setLoader } = useContext(LoaderContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const { t } = useTranslation();

  const dynamicFormRefs = useRef<Map<number, DynamicFormRef>>(new Map());

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

  const [offers, setOffers] = useState<OfferData[]>([
    {
      tableData: [],
      summary: {
        amount: "0",
        vat: "0",
        totalAmount: "0",
        perTonPrice: "0",
        transportationTime: "0",
      },
      note: "",
      rows: [],
      initialRows: [],
    },
  ]);

  const handleExtraChange = (name: string, value: string) =>
    setExtraInputs((prev) => ({ ...prev, [name]: value }));

  const handleOfferNoteChange = (index: number, note: string) => {
    setOffers((prev) =>
      prev.map((offer, i) => (i === index ? { ...offer, note } : offer)),
    );
  };

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

  const handleAddOffer = useCallback(() => {
    const createEmptyRow = (): TableRowData => ({
      id: Date.now(),
      serviceName: "",
      location: "",
      transportMode: "",
      from: "",
      to: "",
      transportType: "",
      packagingType: "",
      packagingSize: "",
      packagingPackage: "",
      netWeight: "",
      grossWeight: "",
      width: "",
      length: "",
      height: "",
      payload: "",
      totalQuantity: "",
      estimatedTime: "",
      purchasePricePerTon: "",
      purchasePricePerUnit: "",
      unit: "",
      totalPurchasePrice: "",
      sellingPrice: "",
      totalPrice: "",
      vatAmount: "",
      vat18: false,
      profit: "",
      vendor: "",
      note: "",
    });

    const newOffer: OfferData = {
      tableData: [createEmptyRow()],
      summary: {
        amount: "0",
        vat: "0",
        totalAmount: "0",
        perTonPrice: "0",
        transportationTime: "0",
      },
      note: "",
      rows: [createEmptyRow()],
      initialRows: [createEmptyRow()],
    };

    setOffers((prev) => [...prev, newOffer]);
  }, []);

  const pageRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadFullPDF = async () => {
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
  };

  const handleSubmit = async (status: "draft" | "send") => {
    if (!selectedCode || !totalWeight) {
      alert("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    setLoader(true);

    const order_offers = offers.map((offer, index) => {
      const dynamicData = dynamicFormRefs.current.get(index)?.getFormData();

      const orderServiceData = offer.tableData.map((row) => ({
        service_id: Number(row.serviceName) || 0,
        vendor_id: row.vendor || "",
        packing: {
          package_type: row.packagingPackage || "",
          packing_type: row.packagingType || "",
          size: Number(row.packagingSize) || 0,
          total_quantity: Number(row.totalQuantity) || 0,
          net_weight: Number(row.netWeight) || 0,
          gross_weight: Number(row.grossWeight) || 0,
          width: Number(row.width) || 0,
          height: Number(row.height) || 0,
          length: Number(row.length) || 0,
        },
        location: row.location || "",
        transport_mode: row.transportMode || "",
        transport_type: row.transportType || "",
        payload: Number(row.payload) || 0,
        total_quantity: Number(row.totalQuantity) || 0,
        estimated_transport_time: Number(row.estimatedTime) || 0,
        purchase_price_per_ton: Number(row.purchasePricePerTon) || 0,
        purchase_price_per_unit: Number(row.purchasePricePerUnit) || 0,
        unit_type: row.unit || "",
        total_purchase_price: Number(row.totalPurchasePrice) || 0,
        selling_price: Number(row.sellingPrice) || 0,
        total_selling_price: Number(row.totalPrice) || 0,
        vat_amount: Number(row.vatAmount) || 0,
        vat_18: row.vat18 || false,
        profit: parseFloat(row.profit as string) || 0,
        note: row.note || "",
      }));

      const shipmentData = {
        shipper: dynamicData?.shipper || "",
        shipper_required: !!dynamicData?.shipper,
        consignee: dynamicData?.consignee || "",
        consignee_required: !!dynamicData?.consignee,
        notify_party: dynamicData?.notifyPartyValue || null,
        notify_party_required: !!dynamicData?.notifyParty,
        terminal: dynamicData?.terminalValue || null,
        terminal_required: !!dynamicData?.terminal,
        container_owner: dynamicData?.containerOwnerValue || null,
        container_owner_required: !!dynamicData?.containerOwner,
        wagon_owner: dynamicData?.wagonOwnerValue || null,
        wagon_owner_required: !!dynamicData?.wagonOwner,
        container_no: dynamicData?.containers?.[0]?.number || null,
        container_no_required:
          dynamicData?.containers?.[0]?.requiredNumber || false,
        container_drop_off: dynamicData?.containers?.[0]?.dropOff || null,
        container_drop_off_required:
          dynamicData?.containers?.[0]?.requiredDropOff || false,
        wagon_no: dynamicData?.wagons?.[0]?.number || null,
        wagon_no_required: dynamicData?.wagons?.[0]?.requiredNumber || false,
        wagon_drop_off: dynamicData?.wagons?.[0]?.dropOff || null,
        wagon_drop_off_required:
          dynamicData?.wagons?.[0]?.requiredDropOff || false,
      };

      return {
        note: offer.note,
        order_service_serializer: orderServiceData,
        shipment_serializer: shipmentData,
        amount: parseFloat(offer.summary.amount) || 0,
        vat: parseFloat(offer.summary.vat) || 0,
        total_amount: parseFloat(offer.summary.totalAmount) || 0,
        per_ton_price: parseFloat(offer.summary.perTonPrice) || 0,
        transportation_time: parseFloat(offer.summary.transportationTime) || 0,
      };
    });

    const formData = new FormData();
    formData.append("offers", JSON.stringify(order_offers));
    formData.append("btn_status:", status);

    try {
      const response = await axios.post(
        `${apiUrl}/commercial/create-offer/?order_id=${order.order_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getCookie("allianceToken"),
          },
        },
      );

      if (response?.status === 200) {
        toast.success(errorMessageHandler(response.data));
        const role = auth.user?.role as string;
        if (role === "commercial_manager") {
          navigate(`/${i18n.language}/commercial/manager/order`);
        } else if (role === "commercial_specialist") {
          navigate(`/${i18n.language}/commercial/specialist`);
        }
      } else {
        toast.error(errorMessageHandler(response.data));
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error("An error occurred while submitting the offer");
    }
    setLoader(false);
  };

  const [, setQuotation] = useState<QuotationType | null>(null);

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
          setQuotation(apiData || null);

          if (apiData) {
            setTotalWeight(apiData.total_weight?.toString() || "");
            setStartDate(apiData.start_date ?? "");
            setEndDate(apiData.end_date ?? "");
            setUnCode(apiData.un_code?.toString() || "");

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

            setOffers([
              {
                tableData: apiData.rows || [],
                summary: apiData.summary || {
                  amount: "0",
                  vat: "0",
                  totalAmount: "0",
                  perTonPrice: "0",
                  transportationTime: "0",
                },
                note: "",
                rows: apiData.rows || [],
                initialRows: apiData.rows || [],
              },
            ]);
          }
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
            ? {
                ...offer,
                tableData: data.rows,
                summary: data.summary,
                rows: data.rows,
              }
            : offer,
        ),
      );
    },
    [],
  );

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

  return (
    <div className={styles.price__quotation} ref={pageRef}>
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <h1 className={styles.title}>{t("price.information")}</h1>
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
                rows={offer.rows}
                summary={offer.summary}
                onTableDataChange={handleTableDataChange}
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
              <DynamicForm ref={(ref) => setDynamicFormRef(index, ref)} />
            </div>
          </div>
        ))}

        <Button
          viewType="green__light"
          text="Add Commercial Offer"
          icon={PlusIcon}
          onClick={handleAddOffer}
        />

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

        <div className={styles.button}>
          <Button
            onClick={() => handleSubmit("draft")}
            text="Save as draft"
            viewType="green__light"
          />
          <Button
            onClick={() => handleSubmit("send")}
            text="Send"
            viewType="dark-green"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInformation;
