import { ChangeEvent } from "react";

type FormValue = {
  name: string;
  data: any;
};

export const formCreator = (values: FormValue[]) => {
  const formData = new FormData();

  values.map((value) => {
    if (value.data || value.data === 0) {
      formData.append(value.name, value.data);
    }
  });

  return formData;
};

export const clearReferenceInputValues = (inputRefs: any) => {
  Object.values(inputRefs).forEach((ref: any) => {
    if (ref.current) ref.current.value = "";
  });
};

// Inputdan aldigim deyeri ancak reqem kimi almag ucun
export const onlyNumberInputValues = (event: ChangeEvent<HTMLInputElement>) => {
  event.target.value = event.target.value.replace(/[^0-9]/g, "");
  return event.target.value;
};

// Reqemlerin 1 000, 10 000, 100 000, shekilinde yazilmasi ucun sora bax

// Inputdan yazdigim Price deyerinin aydin gorsenmeyi ucun
export const formatNumber = (event: ChangeEvent<HTMLInputElement>) => {
  return (event.target.value = event.target.value.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  ));
};

// Remove formatting for internal value storage
export const removeFormatting = (event: ChangeEvent<HTMLInputElement>) => {
  return (event.target.value = event.target.value.replace(/\s/g, ""));
};

export const formatFieldName = (field: string) => {
  return field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");
};

export const generate8CharID = (): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return String(result);
};
