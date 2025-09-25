import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";
import { useEffect, useRef, useState } from "react";
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
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import GetPackagingForm from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import { getCookie } from "@/libs/cookie.ts";

const apiUrl = import.meta.env.VITE_API_URL;

interface QuotationType {
  total_weight: number;
  packing: {
    start_date: string;
    end_date: string;
  };
}

const CustomerInformation = () => {
  const { t } = useTranslation();
  const dynamicFormRef = useRef<{ getFormData: () => DynamicFormData }>(null);

  const [selectedCargo, setSelectedCargo] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [selectedCode, setSelectedCode] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [totalWeight, setTotalWeight] = useState<string>("");
  const [extraInputs, setExtraInputs] = useState({
    field1: "",
    field2: "",
    field3: "",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [offers, setOffers] = useState([{}]);
  const [tableData, setTableData] = useState<TableRowData[]>([]);
  const [summary, setSummary] = useState<TableSummaryData>({
    amount: "0",
    vat: "0",
    totalAmount: "0",
    perTonPrice: "0",
    transportationTime: "0",
  });

  const handleExtraChange = (name: string, value: string) =>
    setExtraInputs((prev) => ({ ...prev, [name]: value }));

  const handleAddOffer = () => setOffers([...offers, {}]);

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

    const dynamicData = dynamicFormRef.current?.getFormData();

    const orderServiceData = tableData.map((row) => ({
      service_id: Number(row.serviceName),
      vendor_id: row.vendorId,
      packing: {
        packing_type: row.packagingType,
        container_type: row.packagingPackage,
        size: Number(row.packagingSize) || 0,
        total_quantity: Number(row.totalQuantity) || 0,
        net_weight: Number(row.netWeight) || 0,
        gross_weight: Number(row.grossWeight) || 0,
        width: Number(row.width) || 0,
        height: Number(row.height) || 0,
        length: Number(row.length) || 0,
      },
      location: row.location,
      transport_mode: row.transportMode,
      transport_type: row.transportType,
      payload: Number(row.payload) || 0,
      total_quantity: Number(row.totalQuantity) || 0,
      estimated_transport_time: Number(row.estimatedTime) || 0,
      purchase_price_per_ton: Number(row.purchasePricePerTon) || 0,
      purchase_price_per_unit: Number(row.purchasePricePerUnit) || 0,
      unit_type: row.unit,
      total_purchase_price: Number(row.totalPurchasePrice) || 0,
      selling_price: Number(row.sellingPrice) || 0,
      total_selling_price: Number(row.totalPrice) || 0,
      vat_amount: Number(row.vatAmount) || 0,
      vat_18: row.vat18 || false,
      profit: parseFloat(row.profit) || 0,
      note: row.note,
      amount: summary.amount,
      vat: summary.vat,
      total_amount: summary.totalAmount,
      per_ton_price: summary.perTonPrice,
      transportation_time: summary.transportationTime,
    }));

    const shipmentData = {
      shipper: dynamicData?.shipper,
      shipper_required: !!dynamicData?.shipper,
      consignee: dynamicData?.consignee,
      consignee_required: !!dynamicData?.consignee,
      notify_party: dynamicData?.notifyPartyValue || null,
      notify_party_required: !!dynamicData?.notifyParty,
      terminal: dynamicData?.terminalValue || null,
      terminal_required: !!dynamicData?.terminal,
      container_owner: dynamicData?.containerOwnerValue || null,
      container_owner_required: !!dynamicData?.containerOwner,
      wagon_owner: dynamicData?.wagonOwnerValue || null,
      wagon_owner_required: !!dynamicData?.wagonOwner,
      container_no: dynamicData?.containers[0]?.number || null,
      container_no_required:
        dynamicData?.containers[0]?.requiredNumber || false,
      container_drop_off: dynamicData?.containers[0]?.dropOff || null,
      container_drop_off_required:
        dynamicData?.containers[0]?.requiredDropOff || false,
      wagon_no: dynamicData?.wagons[0]?.number || null,
      wagon_no_required: dynamicData?.wagons[0]?.requiredNumber || false,
      wagon_drop_off: dynamicData?.wagons[0]?.dropOff || null,
      wagon_drop_off_required: dynamicData?.wagons[0]?.requiredDropOff || false,
    };

    const order_offers = offers.map(() => ({
      note,
      order_service_serializer: orderServiceData,
      shipment_serializer: shipmentData,
    }));

    const formData = new FormData();
    formData.append("order_offers", JSON.stringify(order_offers));
    formData.append("btn_status:", status);

    try {
      const response = await axios.post(
        `${apiUrl}/commercial/create-offer/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getCookie("allianceToken"),
          },
        },
      );

      if (response?.status === 200) {
        toast.success("Offer successfully sent!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Request failed!");
    }
  };

  const [quotation, setQuotation] = useState<QuotationType | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const response = await QuotationData(5);
      if (response?.status === 200) {
        const apiData = response?.data;
        setQuotation(apiData || null);

        if (apiData) {
          setTotalWeight(apiData.total_weight?.toString() || "");
          console.log(quotation);

          const convertToISO = (dateStr?: string) => {
            if (!dateStr) return "";
            const [day, month, year] = dateStr.split(".");
            return `${year}-${month}-${day}`;
          };

          setStartDate(convertToISO(apiData.start_date));
          setEndDate(convertToISO(apiData.end_date));
        }
      }
    };
    fetchRequest();
  }, []);

  const handleTableChange = (data: CompleteTableData) => {
    setTableData(data.rows);
    setSummary(data.summary);
  };

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
          unCode=""
          setUnCode={() => {}}
          msDs={null}
          setMsDs={() => {}}
          msDsPictures={[]}
          setMsDsPictures={() => {}}
          dangerous={false}
          setDangerous={() => {}}
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

        {offers.map((_, index) => (
          <div key={index} style={{ marginBottom: "24px" }}>
            <h1 className={styles.offer__title}>
              Commercial Offer - {index + 1}
            </h1>
            <div className={styles.commercial}>
              <Table onTableDataChange={handleTableChange} />
              <div style={{ width: "100%" }}>
                <Button
                  icon={PdfIcon}
                  text={`Download Commercial Offer ${index + 1}-PDF`}
                  viewType="green__light"
                  onClick={handleDownloadFullPDF}
                />
              </div>
              <Input label="Customer note" placeholder="Your note here" />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <DynamicForm ref={dynamicFormRef} />
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
