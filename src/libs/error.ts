import i18n from "i18next";

export const errorMessageHandler = (error: { [key: string]: string }) => {
  if (error?.[`detail_${i18n.language}`])
    return error?.[`detail_${i18n.language}`];
  else if (error.detail) return error.detail;
  else return error?.["detail_en"];
};
