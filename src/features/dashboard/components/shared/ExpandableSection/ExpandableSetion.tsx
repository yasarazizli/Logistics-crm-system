import React, { useRef, useState } from "react";
import styles from "./ExpandableSection.module.scss";
import { ImageIcon } from "@/assets/icons/shared.vectors.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";

interface ExpandableSectionProps {
  unCode: string;
  setUnCode: (value: string) => void;
  msDs: string;
  setMsDs: (value: string) => void;
  msDsPictures: string[];
  setMsDsPictures: (pictures: string[]) => void;
}

const ExpandableSection = ({
  unCode,
  setUnCode,
  msDs,
  setMsDs,
  msDsPictures,
  setMsDsPictures,
}: ExpandableSectionProps) => {
  const { t } = useTranslation();
  const [open, seOpen] = useState(false);

  const msdsFileRef = useRef<HTMLInputElement | null>(null);
  const msdsPicturesRef = useRef<HTMLInputElement | null>(null);

  const handleMsDsDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMsDs(url);
    }
  };

  const handleMsDsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMsDs(url);
    }
  };

  const handleMsDsClick = () => {
    msdsFileRef.current?.click();
  };

  const handlePicturesDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMsDsPictures([url]);
    }
  };

  const handlePicturesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMsDsPictures([url]);
    }
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
          onChange={() => seOpen(!open)}
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
                <a href={msDs} target="_blank" rel="noopener noreferrer">
                  {msDs}
                </a>
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
              accept="image/*"
              ref={msdsFileRef}
              onChange={handleMsDsSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* MSDS Pictures Dropzone as Link */}
        <div
          className={styles.dropzone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handlePicturesDrop}
          onClick={handlePicturesClick}
        >
          {msDsPictures[0] ? (
            <div className={styles.document}>
              <a
                href={msDsPictures[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {msDsPictures[0]}
              </a>
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
