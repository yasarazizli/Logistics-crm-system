import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef, useState, useEffect } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface NoteProps {
  modalClose: (isRender: boolean, noteText?: string) => void;
  existingNote?: string;
}

const Note = ({ modalClose, existingNote = "" }: NoteProps) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();
  const [noteText, setNoteText] = useState(existingNote);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  useEffect(() => {
    setNoteText(existingNote);
  }, [existingNote]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    if (noteText.trim()) {
      localStorage.setItem("offer_note", noteText.trim());
      modalClose(true, noteText.trim());
      toast.success("Note saved successfully!");
    } else {
      toast.error("Please enter a note!");
    }

    setLoader(false);
  };

  return (
    <Modal title="Note" modalClose={() => modalClose(false)}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.form__inputs}>
          <Input
            inputRef={inputRef}
            type="text"
            label="Note"
            placeholder="Enter your note here"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            autoComplete="none"
            required
            style={{ width: "600px" }}
          />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            type={"button"}
            onClick={() => modalClose(false)}
            viewType="red"
          />
          <Button text="Save Note" type={"submit"} viewType="dark-green" />
        </div>
      </form>
    </Modal>
  );
};

export default Note;
