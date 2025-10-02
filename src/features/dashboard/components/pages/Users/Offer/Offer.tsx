import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "@/components/Button/Button.tsx";
import { toast } from "react-toastify";
import InputSection from "@/features/dashboard/components/shared/InputSection/InputSection.tsx";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";
import GetSelectList from "@/features/dashboard/components/shared/GetSelectList/GetSelectList.tsx";
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import GetPackagingForm from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import { getCookie } from "@/libs/cookie.ts";
import { useLocation } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

interface QuotationType {
  total_weight: number;
  packing: {
    start_date: string;
    end_date: string;
  };
}

const CustomerInformation = () => {
  const location = useLocation();
  const order = location.state?.order;
  const { t } = useTranslation();

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
  const [generalNote, setGeneralNote] = useState("");

  const handleExtraChange = (name: string, value: string) =>
    setExtraInputs((prev) => ({ ...prev, [name]: value }));

  const pageRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (status: "draft" | "send") => {
    if (!selectedCode || !totalWeight) {
      alert("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    const formData = new FormData();
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
        toast.success("Offer successfully sent!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
      toast.error("An error occurred while submitting the offer");
    }
  };

  const [quotation, setQuotation] = useState<QuotationType | null>(null);
  console.log(quotation);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;
          setQuotation(apiData || null);

          if (apiData) {
            setTotalWeight(apiData.total_weight?.toString() || "");
            const convertToISO = (dateStr?: string) => {
              if (!dateStr) return "";
              const [day, month, year] = dateStr.split(".");
              return `${year}-${month}-${day}`;
            };
            setStartDate(convertToISO(apiData.start_date));
            setEndDate(convertToISO(apiData.end_date));
          }
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

        <div className={styles.note}>
          <label className={styles.label}>General Note</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Your general note here"
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
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
