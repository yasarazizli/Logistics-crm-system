import styles from "@/components/Modal/Modal.module.scss";
import { FormEvent, useContext, useRef } from "react";
import Button from "@/components/Button/Button.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { formCreator } from "@/libs/form.ts";
import { toast } from "react-toastify";
import Input from "@/components/Input/Input.tsx";
import { addSellingPriceServicesRequest } from "@/features/dashboard/services/commercialDirectory.service.ts";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";

const AddSellingPrice = ({
  service,
  modalClose,
}: {
  service: ServiceModel;
  modalClose: () => void;
}) => {
  const { setLoader } = useContext(LoaderContext);

  const inputsRef = {
    selling_price: useRef<HTMLInputElement>(null),
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const formData = formCreator([
      {
        name: "price",
        data: inputsRef.selling_price.current?.value,
      },
    ]);
    const { status } = await addSellingPriceServicesRequest(
      formData,
      service.id,
    );
    if (status === 200) {
      modalClose();
      toast.success("Selling Price Teyin edildi");
    }
    setLoader(false);
  };

  return (
    <Modal title={"Selling Price"} modalClose={modalClose}>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.form__inputs}>
          <Input inputRef={inputsRef.selling_price} label="Selling price" />
        </div>

        <div className={styles.form__buttons}>
          <Button
            text={"Ləğv et"}
            viewType={"dark-green"}
            style={{
              width: "fit-content",
              paddingInline: 20,
            }}
            type={"button"}
          />
          <Button
            text={"Yadda saxla"}
            style={{
              width: "fit-content",
              paddingInline: 32,
            }}
            type={"submit"}
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddSellingPrice;
