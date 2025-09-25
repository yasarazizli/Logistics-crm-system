import React, { useRef, useState } from "react";
import styles from "./ExpandableSection.module.scss";
import { ImageIcon } from "@/assets/icons/shared.vectors.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";

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
  dangerous,
  setDangerous,
}: ExpandableSectionProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const msdsFileRef = useRef<HTMLInputElement | null>(null);
  const msdsPicturesRef = useRef<HTMLInputElement | null>(null);

  const handleMsDsDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setMsDs(file);
  };

  const handleMsDsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMsDs(file);
  };

  const handleMsDsClick = () => {
    msdsFileRef.current?.click();
  };

  const handlePicturesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) setMsDsPictures(files);
  };

  const handlePicturesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) setMsDsPictures(files);
  };

  const handlePicturesClick = () => {
    msdsPicturesRef.current?.click();
  };

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
            onDrop={handleMsDsDrop}
            onClick={handleMsDsClick}
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
              ref={msdsFileRef}
              onChange={handleMsDsSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <div
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handlePicturesDrop}
          onClick={handlePicturesClick}
        >
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
            ref={msdsPicturesRef}
            onChange={handlePicturesSelect}
            style={{ display: "none" }}
          />
        </div>
      </section>
    </div>
  );
};

export default ExpandableSection;
