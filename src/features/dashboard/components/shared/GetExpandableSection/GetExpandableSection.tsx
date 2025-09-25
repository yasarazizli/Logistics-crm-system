import { useEffect, useState } from "react";
import styles from "../ExpandableSection/ExpandableSection.module.scss";
import { ImageIcon } from "@/assets/icons/shared.vectors.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

interface ExpandableSectionProps {
  unCode: string;
  setUnCode: (value: string) => void;
  msDs: File | null;
  setMsDs: (file: File | null) => void;
  msDsPictures: File[];
  setMsDsPictures: (files: File[]) => void;
  dangerous: boolean;
  setDangerous: (value: boolean) => void;
}

interface QuotationType {
  dangerous: boolean;
  unCode: string;
  msDs: File | null;
  msDsPictures: File[];
}

const ExpandableSection = ({
  unCode,
  setUnCode,
  msDs,
  setMsDs,
  msDsPictures,
  dangerous,
  setMsDsPictures,
  setDangerous,
}: ExpandableSectionProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [quotation, setQuotation] = useState<QuotationType | null>(null);
  console.log(quotation);

  useEffect(() => {
    const fetchRequest = async () => {
      const response = await QuotationData(5);
      if (response?.status === 200) {
        setQuotation(response.data || null);
        console.log("API-dən gələn məlumat:", response?.data);
        const apiData = response?.data;

        if (apiData) {
          setUnCode(apiData.un_code?.toString() || "");
          setMsDs(apiData.msds?.toString() || "");
          setMsDsPictures(apiData.msDsPictures?.toString() || "");
          setDangerous(apiData.dangerous?.toString() || "");
        }
      }
    };
    fetchRequest();
  }, [setUnCode, setMsDs, setMsDsPictures, setDangerous]);

  return (
    <div className={styles.wrapper}>
      <label className={styles.checkbox}>
        <input
          className={styles.custom__checkbox}
          type="checkbox"
          checked={open}
          onChange={() => {
            setOpen(!open);
            setDangerous(!dangerous);
          }}
        />
        <span>{t("expand.cargo")}</span>
      </label>

      <section className={`${styles.section} ${open ? styles.open : ""}`}>
        <div className={styles.input}>
          <div className={styles.drop__input}>
            <Input
              type="text"
              placeholder="UN code"
              value={unCode}
              onChange={(e) => setUnCode(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div
            className={styles.dropzone__2}
            onDragOver={(e) => e.preventDefault()}
          >
            {msDs ? (
              <div className={styles.document}>
                <span>{msDs.name}</span>
              </div>
            ) : (
              <div className={styles.dropzone__title}>
                <div className={styles.info}>
                  <div className={styles.title}>
                    <p>Upload document</p>
                    <span>upload from computer</span>
                  </div>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf,image/*"
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div className={styles.dropzone} onDragOver={(e) => e.preventDefault()}>
          {msDsPictures.length ? (
            <div className={styles.document}>
              {msDsPictures.map((file, idx) => (
                <span key={idx}>{file.name}</span>
              ))}
            </div>
          ) : (
            <div className={styles.dropzone__title}>
              <div className={styles.img}>
                <ImageIcon />
              </div>
              <div className={styles.info}>
                <div className={styles.title}>
                  <p>Drop your images here or</p>
                  <span>upload from computer</span>
                </div>
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
          />
        </div>
      </section>
    </div>
  );
};

export default ExpandableSection;
