import styles from "./FileInput.module.scss";
import { InputHTMLAttributes, useState } from "react";

const FileInput = ({
  inputRef,
  ...props
}: { inputRef?: any } & InputHTMLAttributes<HTMLInputElement>) => {
  const [file, setFile] = useState<File | null>(null);

  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  return (
    <label className={styles.file__input}>
      <div className={styles.texts}>
        {file ? (
          <p className={styles.title}>
            <span>{file.name}</span>
          </p>
        ) : (
          <p className={styles.title}>
            Drop your files here or <span>browse</span>
          </p>
        )}
        <p className={styles.subtitle}>
          {file
            ? `Size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
            : "Maximum size: 3MB"}
        </p>
      </div>
      <input
        placeholder="fileInput"
        ref={inputRef}
        type="file"
        onChange={handleChange}
        accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
        {...props}
      />
    </label>
  );
};

export default FileInput;
