import styles from "@/components/Modal/Modal.module.scss";
import Input from "@/components/Input/Input.tsx";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { FormEvent, useContext, useRef, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import { postLawyerUser } from "@/features/dashboard/services/LawyerUsers/lawyerusers.service.ts";

interface Lawyer {
  phone: string;
  contract_start_date: string;
  contract_end_date: string;
}

const VerifyLawyer = ({
  modalClose,
  id,
  lawyer,
}: {
  modalClose: (isRender: boolean) => void;
  id: number;
  lawyer: Lawyer;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const { t } = useTranslation();

  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [protocolFileName, setProtocolFileName] = useState<string>("");

  const handleFileChangeProtocol = () => {
    const file = inputsRef.contract_file.current?.files?.[0];
    if (file) setProtocolFileName(file.name);
  };

  const inputsRef = {
    contract_number: useRef<HTMLInputElement>(null),
    contract_language: useRef<HTMLSelectElement>(null),
    bank: useRef<HTMLSelectElement>(null),
    contract_start_time: useRef<HTMLInputElement>(null),
    contract_end_time: useRef<HTMLInputElement>(null),
    payment_type: useRef<HTMLSelectElement>(null),
    contract_file: useRef<HTMLInputElement>(null),

    // post pay
    interest: useRef<HTMLInputElement>(null),
    period: useRef<HTMLInputElement>(null),
    max_credit_limit: useRef<HTMLSelectElement>(null),
  };

  const [contractNumber, setContractNumber] = useState(lawyer?.phone || "");

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const formData = formCreator([
      {
        name: "contract_number",
        data: inputsRef.contract_number.current?.value,
      },
      {
        name: "contract_language",
        data: inputsRef.contract_language.current?.value,
      },
      {
        name: "bank",
        data: inputsRef.bank.current?.value,
      },
      {
        name: "contract_start_time",
        data: inputsRef.contract_start_time.current?.value
          ? new Date(inputsRef.contract_start_time.current.value).toISOString()
          : null,
      },
      {
        name: "contract_end_time",
        data: inputsRef.contract_end_time.current?.value
          ? new Date(inputsRef.contract_end_time.current.value).toISOString()
          : null,
      },
      { name: "payment_type", data: inputsRef.payment_type.current?.value },

      {
        name: "contract_file",
        data: inputsRef.contract_file.current?.files?.[0],
      },

      // post pay

      ...(selectedPaymentType === "postpay"
        ? [
            { name: "interest", data: inputsRef.interest.current?.value },
            { name: "period", data: inputsRef.period.current?.value },
            {
              name: "max_credit_limit",
              data: inputsRef.max_credit_limit.current?.value,
            },
          ]
        : []),
    ]);

    const { status, data } = await postLawyerUser(formData, id);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));

    setLoader(false);
    modalClose(true);
  };

  const language = ["English", "Azerbaijan", "Russian"];

  const bank = [
    "ABB (RUB)",
    "ABB (USD)",
    "ABB (AZN)",
    "Pasha Bank (USD)",
    "Pasha Bank (RUB)",
    "Pasha Bank (EUR)",
    "Pasha Bank (AZN)",
  ];

  const payment = ["prepay", "postpay"];

  return (
    <Modal
      title={t("workers.modals.create.verify")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={create}>
        <div className={styles.form__inputs}>
          <Input
            type="text"
            label={t("workers.modals.create.inputs.full_name.contract__number")}
            placeholder={t(
              "workers.modals.create.inputs.full_name.contract__placeholder",
            )}
            inputRef={inputsRef.contract_number}
            autoComplete="off"
            required
            value={contractNumber}
            onChange={(e) => setContractNumber(e.target.value)}
          />
          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("workers.modals.create.inputs.description.language")}
            </label>
            <select
              className={styles.select}
              required
              name="contract_language"
              ref={inputsRef.contract_language}
            >
              <option value="">
                {t(
                  "workers.modals.create.inputs.description.language__placeholder",
                )}
              </option>
              {language.map((lang) => (
                <option key={lang} value={lang}>
                  {t(`workers.language.${lang}`)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selectWrapper}>
            <label className={styles.label}>{"Select Bank"}</label>
            <select
              className={styles.select}
              required
              name="contract_language"
              ref={inputsRef.bank}
            >
              <option value="">{"Select Bank"}</option>
              {bank.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <Input
            type="date"
            label={t("workers.contract.start__time")}
            inputRef={inputsRef.contract_start_time}
            autoComplete="off"
            required
          />
          <Input
            type="date"
            label={t("workers.contract.start__time__end")}
            inputRef={inputsRef.contract_end_time}
            autoComplete="off"
            required
          />
          <div className={styles.selectWrapper}>
            <label className={styles.label}>
              {t("workers.contract.payment__name")}
            </label>
            <select
              className={styles.select}
              required
              name="payment_type"
              ref={inputsRef.payment_type}
              onChange={(e) => setSelectedPaymentType(e.target.value)}
            >
              <option value="">
                {t("workers.contract.payment__placeholder")}
              </option>
              {payment.map((pay) => (
                <option key={pay} value={pay}>
                  {t(`workers.payment.${pay}`)}
                </option>
              ))}
            </select>
            <div className={styles.dropzone}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 11,
                }}
              >
                <span>Contract File</span>
                <label
                  htmlFor="protocol-file-upload"
                  className={styles.dropzone__label}
                  style={{ height: "54px" }}
                >
                  {protocolFileName ||
                    t("services.modals.create.file__placeholder")}
                </label>
                <input
                  type="file"
                  id="protocol-file-upload"
                  ref={inputsRef.contract_file}
                  onChange={handleFileChangeProtocol}
                  className={styles.dropzone__input}
                  accept="*/*"
                />
              </div>
            </div>
          </div>
          {selectedPaymentType === "postpay" && (
            <>
              <Input
                type="text"
                label={t("workers.contract.interest__rate")}
                placeholder={t("workers.contract.payment__placeholder")}
                inputRef={inputsRef.interest}
                autoComplete="off"
                required
              />
              <Input
                type="text"
                label={t("workers.contract.payment__rate")}
                placeholder={t("workers.contract.payment__placeholder")}
                inputRef={inputsRef.period}
                autoComplete="off"
                required
              />
              <Input
                type="text"
                label={t("workers.contract.maximum")}
                placeholder={t("workers.contract.payment__placeholder")}
                inputRef={inputsRef.max_credit_limit}
                autoComplete="off"
                required
              />
            </>
          )}
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("shared.buttons.cancel")}
            viewType="red"
            type="button"
            onClick={() => modalClose(false)}
          />
          <Button text={t("shared.buttons.save")} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default VerifyLawyer;
