export type Roles = "client" | "";

export interface UserModel {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  birth_day: string;
  role: Roles;
  balance: number;
  contract: null | string;
  contract_status: number;
  contract_start_date: null | string;
  contract_end_date: null | string;
  company_name: null | string;
  identity_number: string;
  commercial_manager: string;
  accountant: {
    id: number;
    full_name: string;
  };
}

export interface TaskModel {
  id: number;
  country_name: string;
  city_name: string;
  not: string;
}
