import styles from "./PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import { useTranslation } from "react-i18next";
import SelectList from "@/features/dashboard/components/shared/SelectList/SelectList.tsx";
import Input from "@/components/Input/Input.tsx";
import { useState } from "react";
import axios from "axios";
import ExpandableSection from "@/features/dashboard/components/shared/ExpandableSection/ExpandableSetion.tsx";
import PackagingForm, {
  PackagingData,
} from "@/features/dashboard/components/shared/PackagingForm/PackagingForm.tsx";
import Button from "@/components/Button/Button.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

const PriceQuotation = () => {
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

  const [unCode, setUnCode] = useState("");
  const [msDs, setMsDs] = useState("");
  const [msDsPictures, setMsDsPictures] = useState<string[]>([]);

  const [packagingData, setPackagingData] = useState<PackagingData>({
    packing_type: "Container",
    total_quantity: 0,
    net_weight: 0,
    gross_weight: 0,
  });

  const handleSubmit = async () => {
    if (!selectedCode || !totalWeight || !unCode) {
      alert("Please fill all required fields");
      return;
    }

    const data = {
      hs_code_id: selectedCode.value,
      cargo_name: selectedCargo?.label || "",
      total_weight: parseFloat(totalWeight),
      un_code: unCode,
      ms_ds: msDs,
      ms_ds_pictures: msDsPictures[0] || "",
      packing: packagingData,
    };

    try {
      const response = await axios.post(`${apiUrl}/your-endpoint/`, data);
      console.log("Server response:", response.data);
      alert("Data sent successfully!");
    } catch (error) {
      console.error("Error sending data:", error);
      alert("Failed to send data");
    }
  };

  const handlePackagingDataChange = (data: PackagingData) => {
    setPackagingData(data);
  };

  return (
    <div className={styles.price__quotation}>
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <h1 className={styles.title}>{t("price.title")}</h1>
          <div className={styles.input__list}>
            <SelectList
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
          <ExpandableSection
            unCode={unCode}
            setUnCode={setUnCode}
            msDs={msDs}
            setMsDs={setMsDs}
            msDsPictures={msDsPictures}
            setMsDsPictures={setMsDsPictures}
          />
        </div>

        <PackagingForm onDataChange={handlePackagingDataChange} />

        <div>
          <h1 className={styles.period}>Period of Transportation</h1>
          <div className={styles.date}>
            <Input
              type={"date"}
              label={"Start Date"}
              style={{ height: "52px" }}
            />
            <Input
              type={"date"}
              label={"End Date"}
              style={{ height: "52px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Input type={"text"} label={"Note"} placeholder={"Your note here"} />
        </div>

        <div className={styles.button}>
          <Button onClick={handleSubmit} text="Save" viewType="green__light" />
          <Button
            onClick={handleSubmit}
            text="Send to Commercial Manager"
            viewType="dark-green"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceQuotation;
