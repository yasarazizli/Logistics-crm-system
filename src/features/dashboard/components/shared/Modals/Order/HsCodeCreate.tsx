import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/contexts/DataContext.tsx";
import { getAllHsCodeRequest } from "@/features/dashboard/services/location.service.ts";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { HsCodeModel } from "@/models/station.model.ts";
import { HsCodeIcon } from "@/assets/icons/order.vectors.tsx";
import { useTranslation } from "react-i18next";

const HsCodeCreate = ({
  modalClose,
  submit,
}: {
  modalClose: () => void;
  submit: (code: HsCodeModel) => void;
}) => {
  const { t } = useTranslation();
  const { store } = useContext(DataContext);
  const [hsCode, setHsCode] = useState<HsCodeModel[]>([]);
  const [filter, setFilter] = useState("");

  const getFilter = async (filter: string) => {
    const { status, data } = await getAllHsCodeRequest("", "", filter, "");
    if (status === 200) {
      setHsCode(data);
    } else toast.error(errorMessageHandler(data));
  };

  useEffect(() => {
    if (filter !== "") {
      getFilter(filter).catch(() => {});
    } else {
      setHsCode(store?.hsCode ?? []);
    }
  }, [filter]);

  return (
    <>
      <Modal title={"Hs Kodu Daxil Edin"} modalClose={modalClose}>
        <div className={styles.form__inputs}>
          <Input
            maxLength={10}
            required
            icon={HsCodeIcon}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
          />
          <div
            style={{
              width: "700px",
              maxHeight: "200px",
              minHeight: "200px",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {hsCode?.map((code, index: number) => (
              <div
                onClick={() => {
                  submit(code);
                }}
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px dashed #828282",
                  background: "0F0F0F",
                  color: "#436BFD",
                }}
              >
                <p
                  style={{
                    borderRadius: "6px",
                    padding: "12px",
                    background: "rgba(67, 107, 253, 0.12)",
                  }}
                >
                  Hs Code: {code.code}
                </p>
                <p
                  style={{
                    borderRadius: "6px",
                    padding: "12px",
                    background: "rgba(67, 107, 253, 0.12)",
                  }}
                >
                  Cargo name: {code.cargo}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType={"dark-green"}
            type={"button"}
            onClick={() => {
              modalClose();
            }}
          />
          <Button text={t("shared.buttons.save")} />
        </div>
      </Modal>
    </>
  );
};

export default HsCodeCreate;
