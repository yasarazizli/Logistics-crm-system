import { useEffect, useState } from "react";
import styles from "../ExpandableSection/ExpandableSection.module.scss";
import { ImageIcon } from "@/assets/icons/shared.vectors.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import { useLocation } from "react-router-dom";

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

const ExpandableSection = ({
  unCode,
  setUnCode,
  msDs,
  setMsDs,
  msDsPictures,
  setMsDsPictures,
  setDangerous,
}: ExpandableSectionProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [msdsPreview, setMsdsPreview] = useState<string | null>(null);
  const [msdsFileName, setMsdsFileName] = useState<string>("");
  const [cargoImagePreview, setCargoImagePreview] = useState<string | null>(
    null,
  );
  const [cargoImageFileName, setCargoImageFileName] = useState<string>("");
  const [, setImagePreviews] = useState<string[]>([]);
  const location = useLocation();
  const order = location.state?.order;

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleMsdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMsDs(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMsdsPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setMsdsFileName(file.name);
    } else {
      setMsdsPreview(null);
      setMsdsFileName("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMsDsPictures([...msDsPictures, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMsds = () => {
    setMsDs(null);
    setMsdsPreview(null);
    setMsdsFileName("");
  };

  const handleRemoveCargoImage = () => {
    setCargoImagePreview(null);
    setCargoImageFileName("");
  };

  const getFileNameFromPath = (filePath: string): string => {
    if (!filePath) return "";
    return filePath.split("/").pop() || filePath;
  };

  const getFullFileUrl = (filePath: string) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${apiUrl}/${filePath.replace("static/files/", "")}`;
  };

  useEffect(() => {
    const fetchRequest = async () => {
      if (!order?.order_id) return;

      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response.data;

          if (apiData) {
            setUnCode(apiData.un_code?.toString() || "");

            const dangerousValue =
              apiData.dangerous === true ||
              apiData.dangerous === "true" ||
              apiData.dangerous === 1;

            setDangerous(dangerousValue);
            setOpen(dangerousValue);

            if (apiData.msds) {
              const fullMsdsUrl = getFullFileUrl(apiData.msds);
              const fileName = getFileNameFromPath(apiData.msds);

              setMsdsFileName(fileName);
              if (fullMsdsUrl) {
                setMsdsPreview(fullMsdsUrl);
              }
            }

            if (apiData.cargo_image) {
              const fullCargoImageUrl = getFullFileUrl(apiData.cargo_image);
              const fileName = getFileNameFromPath(apiData.cargo_image);

              setCargoImageFileName(fileName);
              if (fullCargoImageUrl) {
                setCargoImagePreview(fullCargoImageUrl);
              }
            }

            if (
              apiData.cargo_image_urls &&
              Array.isArray(apiData.cargo_image_urls)
            ) {
              const fullImageUrls = apiData.cargo_image_urls
                .map((path: any) => getFullFileUrl(path))
                .filter((url: any): url is string => url !== null);
              setImagePreviews(fullImageUrls);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching quotation data:", error);
      }
    };

    fetchRequest();
  }, [order, setUnCode, setDangerous]);

  const handleToggleSection = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    setDangerous(newOpenState);
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.checkbox}>
        <input
          className={styles.custom__checkbox}
          type="checkbox"
          checked={open}
          onChange={handleToggleSection}
        />
        <span>{t("expand.cargo")}</span>
      </label>

      <section className={`${styles.section} ${open ? styles.open : ""}`}>
        <div className={styles.input}>
          <div className={styles.drop__input}>
            <Input
              label="Un code"
              type="text"
              placeholder="UN code"
              value={unCode}
              onChange={(e) => setUnCode(e.target.value)}
              className={styles.textInput}
            />
          </div>

          {/* MSDS Upload */}
          <div className={styles.uploadSection}>
            <label className={styles.uploadLabel}>Upload MSDS</label>
            <div
              className={styles.dropzone__2}
              onClick={() => document.getElementById("msds-upload")?.click()}
            >
              {msDs || msdsPreview ? (
                <div className={styles.document}>
                  <span>{msDs?.name || msdsFileName || "MSDS Document"}</span>
                  {msdsPreview && (
                    <div className={styles.preview}>
                      {msdsPreview.includes(".pdf") ? (
                        <embed
                          src={msdsPreview}
                          type="application/pdf"
                          width="100%"
                          height="200px"
                        />
                      ) : (
                        <img src={msdsPreview} />
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMsds();
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className={styles.dropzone__title}>
                  <div className={styles.info}>
                    <div className={styles.title}>
                      <p>Upload MSDS document</p>
                      <span>Click to upload from computer</span>
                    </div>
                  </div>
                </div>
              )}
              <input
                id="msds-upload"
                type="file"
                accept="application/pdf,image/*"
                onChange={handleMsdsChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Cargo Image Upload */}
        <div className={styles.uploadSection__1}>
          <div
            className={styles.dropzone}
            onClick={() =>
              document.getElementById("cargo-image-upload")?.click()
            }
          >
            {cargoImagePreview ? (
              <div className={styles.document}>
                <span>{cargoImageFileName || "Cargo Image"}</span>
                <div className={styles.preview}>
                  <img
                    src={cargoImagePreview}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCargoImage();
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className={styles.dropzone__title}>
                <div className={styles.img}>
                  <ImageIcon />
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>
                    <p>Drop your cargo image here or</p>
                    <span>click to upload from computer</span>
                  </div>
                </div>
              </div>
            )}
            <input
              id="cargo-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpandableSection;
