import { useEffect, useState } from "react";
import styles from "../ExpandableSection/ExpandableSection.module.scss";
import { DownloadIcon, ImageIcon } from "@/assets/icons/shared.vectors.tsx";
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

  const [msdsFileName, setMsdsFileName] = useState<string>("");
  const [cargoImageFileName, setCargoImageFileName] = useState<string>("");

  const [msdsUrl, setMsdsUrl] = useState<string>("");
  const [cargoImageUrl, setCargoImageUrl] = useState<string>("");

  const location = useLocation();
  const order = location.state?.order;

  const handleMsdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMsDs(file);

    if (file) {
      setMsdsFileName(file.name);
      setMsdsUrl("");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMsDsPictures([...msDsPictures, ...files]);
    setCargoImageUrl("");
  };

  const handleRemoveMsds = () => {
    setMsDs(null);
    setMsdsFileName("");
    setMsdsUrl("");
  };

  const handleRemoveCargoImage = () => {
    setMsDsPictures([]);
    setCargoImageFileName("");
    setCargoImageUrl("");
  };

  const getFileNameFromPath = (filePath: string): string => {
    if (!filePath) return "";
    return filePath.split("/").pop() || filePath;
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
              setMsdsUrl(apiData.msds);
              setMsdsFileName(getFileNameFromPath(apiData.msds));
            }

            if (apiData.cargo_image) {
              setCargoImageUrl(apiData.cargo_image);
              setCargoImageFileName(getFileNameFromPath(apiData.cargo_image));
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
    const newOpen = !open;
    setOpen(newOpen);
    setDangerous(newOpen);
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

          <div className={styles.uploadSection}>
            <label className={styles.uploadLabel}>Upload MSDS</label>
            <div
              className={styles.dropzone__2}
              onClick={() => document.getElementById("msds-upload")?.click()}
            >
              {msDs || msdsFileName ? (
                <div className={styles.document}>
                  <span>{msDs?.name || msdsFileName}</span>

                  {(msDs || msdsUrl) && (
                    <a
                      href={msDs ? URL.createObjectURL(msDs) : msdsUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DownloadIcon />
                    </a>
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
                accept="*/*"
                onChange={handleMsdsChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div className={styles.uploadSection__1}>
          <div
            className={styles.dropzone}
            onClick={() =>
              document.getElementById("cargo-image-upload")?.click()
            }
          >
            {msDsPictures.length > 0 || cargoImageFileName ? (
              <div className={styles.document}>
                {msDsPictures.map((file, index) => (
                  <div key={index} className={styles.fileItem}>
                    <span>{file.name}</span>

                    <a
                      href={URL.createObjectURL(file)}
                      download={file.name}
                      target="_blank"
                      className={styles.downloadBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DownloadIcon />
                    </a>

                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        const newFiles = [...msDsPictures];
                        newFiles.splice(index, 1);
                        setMsDsPictures(newFiles);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {cargoImageUrl && msDsPictures.length === 0 && (
                  <div className={styles.fileItem}>
                    <span>{cargoImageFileName}</span>

                    <a
                      href={cargoImageUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadBtn}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DownloadIcon />
                    </a>

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
                )}
              </div>
            ) : (
              <div className={styles.dropzone__title}>
                <div className={styles.img}>
                  <ImageIcon />
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>
                    <p>Drop your cargo images here or</p>
                    <span>click to upload from computer</span>
                  </div>
                </div>
              </div>
            )}

            <input
              id="cargo-image-upload"
              type="file"
              accept="*/*"
              multiple
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
