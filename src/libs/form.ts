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
export const formatFieldName = (field: string) => {
  return field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ");
};
