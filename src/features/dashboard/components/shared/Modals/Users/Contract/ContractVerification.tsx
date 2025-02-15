import Button from "@/components/Button/Button.tsx";
import styles from "@/components/Modal/Modal.module.scss";
import Modal from "@/components/Modal/Modal.tsx";
import Input from "@/components/Input/Input.tsx";
import { FormEvent, useContext, useRef, useState } from "react";
import { formCreator, onlyNumberInputValues } from "@/libs/form.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { postVerifiedUserContractRequest } from "@/features/dashboard/services/user.service.ts";
import { toast } from "react-toastify";
import SelectOption from "@/components/New/SelectOption/SelectOption.tsx";
import { useTranslation } from "react-i18next";
import { errorMessageHandler } from "@/libs/error.ts";
import {
  dateToInputFormat,
  getEndDateMinValue,
  handleStartDateChange,
} from "@/libs/date.ts";
import { ContractLanguageConstant } from "@/features/dashboard/constants/selections.constant.tsx";

const ContractVerification = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: (isRender: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { setLoader } = useContext(LoaderContext);

  const [isPostPay, setIsPostPay] = useState<boolean>(false);

  const inputsRef = {
    contract_number: useRef<HTMLInputElement>(null),
    contract_language: useRef<HTMLInputElement>(null),
    contract_start_date: useRef<HTMLInputElement>(null),
    contract_end_date: useRef<HTMLInputElement>(null),
    max_credit_limit: useRef<HTMLInputElement>(null),
    interest: useRef<HTMLInputElement>(null),
    period: useRef<HTMLInputElement>(null),
    payment: useRef<HTMLInputElement>(null),
  };

  // User Contract Verification
  const userContractVerification = async (event: FormEvent) => {
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
        name: "contract_start_time",
        data: new Date(
          inputsRef.contract_start_date.current?.value || "",
        ).toISOString(),
      },
      {
        name: "contract_end_time",
        data: new Date(
          inputsRef.contract_end_date.current?.value || "",
        ).toISOString(),
      },
      {
        name: "max_credit_limit",
        data: inputsRef.max_credit_limit.current?.value,
      },
      {
        name: "payment_type",
        data: inputsRef.payment.current?.value || 0,
      },
      {
        name: "interest",
        data: inputsRef.interest.current?.value || 0,
      },
      {
        name: "period",
        data: inputsRef.period.current?.value || 0,
      },
    ]);
    const { status, data } = await postVerifiedUserContractRequest(
      formData,
      id,
    );

    if (status === 200) {
      modalClose(true);
      toast.success(errorMessageHandler(data));
    } else toast.error(errorMessageHandler(data));

    setLoader(false);
  };

  return (
    <Modal
      title={t("users.modals.contract_verification.title")}
      modalClose={() => modalClose(false)}
    >
      <form className={styles.form} onSubmit={userContractVerification}>
        <div className={styles.form__inputs}>
          {/* Contract Number & Language */}
          <div className={styles.grid}>
            <Input
              type="text"
              label={t("users.modals.contract_verification.contract_number")}
              inputRef={inputsRef.contract_number}
              required
            />

            <SelectOption
              label={t("vendors.modals.create.inputs.contract_language")}
              required
              inputRef={inputsRef.contract_language}
              options={ContractLanguageConstant}
            />
          </div>

          {/* Contract Validate Date */}
          <div className={styles.grid}>
            <Input
              label={t(
                "users.modals.contract_verification.contract_start_time",
              )}
              type="date"
              min={dateToInputFormat(new Date().toISOString())}
              inputRef={inputsRef.contract_start_date}
              onChange={() => handleStartDateChange(inputsRef)}
              required
            />
            <Input
              label={t("users.modals.contract_verification.contract_end_time")}
              type="date"
              min={getEndDateMinValue(inputsRef)}
              inputRef={inputsRef.contract_end_date}
              required
            />
          </div>

          {/* Contract Number & Language */}
          <SelectOption
            label={t("users.modals.contract_verification.payment_methods")}
            required={true}
            inputRef={inputsRef.payment}
            onChange={(options) => setIsPostPay(options.value === "postpay")}
            options={[
              {
                name: "Post Pay",
                value: "postpay",
              },
              {
                name: "Pre Pay",
                value: "prepay",
              },
            ]}
          />

          {isPostPay && (
            <>
              <Input
                label={t("users.modals.contract_verification.interest_rate")}
                maxLength={3}
                defaultValue={inputsRef.interest.current?.value || ""}
                required
                inputRef={inputsRef.interest}
                onChange={(event) => {
                  const value: string = event.target.value.replace(/\D/g, "");

                  let numericValue = parseInt(value, 10);

                  if (isNaN(numericValue)) {
                    numericValue = 0;
                  }

                  if (numericValue > 100) {
                    numericValue = 100;
                  }

                  event.target.value = `${numericValue}`;
                }}
              />

              <Input
                label={t("users.modals.contract_verification.payment_period")}
                maxLength={3}
                required
                inputRef={inputsRef.period}
                onChange={(event) => {
                  const value: string = event.target.value.replace(/\D/g, "");

                  let numericValue = parseInt(value, 10);

                  if (isNaN(numericValue)) {
                    numericValue = 0;
                  }

                  if (numericValue > 365) {
                    numericValue = 365;
                  }

                  event.target.value = `${numericValue}`;
                }}
              />

              <Input
                label={t("users.modals.contract_verification.credit_limit")}
                maxLength={10}
                required
                inputRef={inputsRef.max_credit_limit}
                onChange={(event) => {
                  onlyNumberInputValues(event);
                }}
              />
            </>
          )}
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={t("users.modals.contract_verification.buttons.cancel")}
            viewType={"dark-green"}
            type={"button"}
            onClick={() => modalClose(false)}
          />
          <Button
            text={t("users.modals.contract_verification.buttons.save")}
            type={"submit"}
          />
        </div>
      </form>
    </Modal>
  );
};

export default ContractVerification;
