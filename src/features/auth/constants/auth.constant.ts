import {
  ArchiveIcon,
  CompanyIcon,
  NameIcon,
  PasswordIcon,
  PhoneIcon,
} from "@/assets/images/auth/auth.vector.tsx";

import { MailIcon } from "@/assets/icons/shared.vectors.tsx";

import { ChangeEvent } from "react";

// Login
export const loginTabs = [
  {
    name: "login.tabs.login",
    link: "login",
  },
  {
    name: "login.tabs.sign__up",
    link: "register",
  },
];

export const loginInputs = [
  {
    label: "login.inputs.email.label",
    placeholder: "login.inputs.email.placeholder",
    icon: MailIcon,
    type: "email",
    inputRefName: "email",
  },
  {
    label: "login.inputs.password.label",
    placeholder: "login.inputs.password.placeholder",
    icon: PasswordIcon,
    type: "password",
    inputRefName: "password",
  },
];

// Login
export const registerCompanyInputs = [
  {
    label: "register.inputs.full__name.label",
    placeholder: "register.inputs.full__name.placeholder",
    icon: NameIcon,
    inputRefName: "full_name",
    type: "text",
    onChange: () => {},
  },
  {
    label: "register.inputs.company.label",
    placeholder: "register.inputs.company.placeholder",
    icon: CompanyIcon,
    inputRefName: "company_name",
    type: "text",
    onChange: () => {},
  },
  {
    label: "register.inputs.email.label",
    placeholder: "register.inputs.email.placeholder",
    icon: MailIcon,
    inputRefName: "email",
    type: "email",
    onChange: () => {},
  },
  {
    label: "register.inputs.phone.label",
    placeholder: "register.inputs.phone.placeholder",
    icon: PhoneIcon,
    inputRefName: "phone",
    type: "text",
    onChange: () => {},
  },
  {
    label: "register.inputs.password.label",
    placeholder: "register.inputs.password.placeholder",
    icon: PasswordIcon,
    inputRefName: "password",
    type: "password",
    onChange: () => {},
  },
  {
    label: "register.inputs.re__password.label",
    placeholder: "register.inputs.re__password.placeholder",
    icon: PasswordIcon,
    inputRefName: "confirm__password",
    type: "password",
    onChange: () => {},
  },
  {
    label: "register.inputs.tin__code.label",
    placeholder: "register.inputs.tin__code.placeholder",
    icon: ArchiveIcon,
    inputRefName: "identity_number",
    type: "text",
    onChange: () => {},
  },
];

export const registerIndividualInputs = [
  {
    label: "register.inputs.full__name.label",
    placeholder: "register.inputs.full__name.placeholder",
    icon: NameIcon,
    inputRefName: "name",
    type: "text",
    onChange: () => {},
  },
  {
    label: "register.inputs.email.label",
    placeholder: "register.inputs.email.placeholder",
    icon: MailIcon,
    inputRefName: "email",
    type: "email",
    onChange: () => {},
  },
  {
    label: "register.inputs.phone.label",
    placeholder: "register.inputs.phone.placeholder",
    icon: PhoneIcon,
    inputRefName: "phone",
    type: "text",
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);
    },
  },
  {
    label: "register.inputs.password.label",
    placeholder: "register.inputs.password.placeholder",
    icon: PasswordIcon,
    inputRefName: "password",
    type: "password",
    onChange: () => {},
  },
  {
    label: "register.inputs.re__password.label",
    placeholder: "register.inputs.re__password.placeholder",
    icon: PasswordIcon,
    inputRefName: "confirm__password",
    type: "password",
    onChange: () => {},
  },
  {
    label: "register.inputs.fin__code.label",
    placeholder: "register.inputs.fin__code.placeholder",
    icon: ArchiveIcon,
    inputRefName: "code",
    type: "text",
    onChange: () => {},
  },
];
