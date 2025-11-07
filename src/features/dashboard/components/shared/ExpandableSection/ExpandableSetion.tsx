import React, { useRef, useState, useEffect } from "react";
import styles from "./ExpandableSection.module.scss";
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
  const [cargoImagePreview, setCargoImagePreview] = useState<string | null>(
    null,
  );

  const msdsFileRef = useRef<HTMLInputElement | null>(null);
  const msdsPicturesRef = useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const order = location.state?.order;
  const apiUrl = import.meta.env.VITE_API_URL;

  const getFullFileUrl = (filePath: string) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${apiUrl}/${filePath.replace("static/files/", "")}`;
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
              const fullMsdsUrl = getFullFileUrl(apiData.msds);
              if (fullMsdsUrl) {
                setMsdsPreview(fullMsdsUrl);
              }
            }

            if (apiData.cargo_image) {
              const fullCargoImageUrl = getFullFileUrl(apiData.cargo_image);
              if (fullCargoImageUrl) {
                setCargoImagePreview(fullCargoImageUrl);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching quotation data:", error);
      }
    };

    fetchRequest();
  }, [order, setUnCode, setDangerous]);

  const handleMsDsDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMsDs(file);
      setMsdsPreview(null);
    }
  };

  const handleMsDsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMsDs(file);
      setMsdsPreview(null);
    }
  };

  const handleMsDsClick = () => {
    msdsFileRef.current?.click();
  };

  const handlePicturesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      setMsDsPictures(files);
      setCargoImagePreview(null);
    }
  };

  const handlePicturesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) {
      setMsDsPictures(files);
      setCargoImagePreview(null);
    }
  };

  const handlePicturesClick = () => {
    msdsPicturesRef.current?.click();
  };

  const handleRemoveMsds = () => {
    setMsDs(null);
    setMsdsPreview(null);
    if (msdsFileRef.current) {
      msdsFileRef.current.value = "";
    }
  };

  const handleRemoveCargoImage = () => {
    setMsDsPictures([]);
    setCargoImagePreview(null);
    if (msdsPicturesRef.current) {
      msdsPicturesRef.current.value = "";
    }
  };

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
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleMsDsDrop}
              onClick={handleMsDsClick}
            >
              {msDs || msdsPreview ? (
                <div className={styles.document}>
                  <span>
                    {msDs?.name ||
                      getFileNameFromPath(order?.msds || "") ||
                      "MSDS Document"}
                  </span>
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
                        <img
                          src={msdsPreview}
                          alt="MSDS Preview"
                          style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
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
                type="file"
                accept="application/pdf,image/*"
                ref={msdsFileRef}
                onChange={handleMsDsSelect}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        {/* Cargo Images Upload */}
        <div className={styles.uploadSection__1}>
          <div
            className={styles.dropzone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handlePicturesDrop}
            onClick={handlePicturesClick}
          >
            {msDsPictures.length > 0 || cargoImagePreview ? (
              <div className={styles.document}>
                {msDsPictures.map((file, idx) => (
                  <span key={idx}>{file.name}</span>
                ))}
                {cargoImagePreview && msDsPictures.length === 0 && (
                  <div className={styles.preview}>
                    <img
                      src={cargoImagePreview}
                      alt="Cargo Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </div>
                )}
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
                    <p>Drop your cargo images here or</p>
                    <span>click to upload from computer</span>
                  </div>
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={msdsPicturesRef}
              onChange={handlePicturesSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpandableSection;
