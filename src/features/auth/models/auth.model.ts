import { RefObject } from "react";

export interface registerInputsRefModel {
  full_name: RefObject<HTMLInputElement>;
  company_name: RefObject<HTMLInputElement>;
  email: RefObject<HTMLInputElement>;
  phone: RefObject<HTMLInputElement>;
  password: RefObject<HTMLInputElement>;
  confirm__password: RefObject<HTMLInputElement>;
  identity_number: RefObject<HTMLInputElement>;
}
