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

export interface OrderModel {
  ID: number;
  Seller: number | null;
  User: UserModel;
  created: string;
  draft: boolean;
  end_time: string;
  expeditor: string;
  is_delete: boolean;
  note: string;
  receiver: string;
  request_type: string;
  seller_id: number | null;
  shipper: string;
  start_time: string;
  status: string;
  updated: string;
  user_id: number;
}

export interface RouteModel {
  note: string;
  order_id: number;
  priority: number;
  transport_id: number;
  type: string;

  // Bildiklerim
  start_country_id: number;
  start_city_id: number;
  start_address: string;
  start_station_id: number;

  end_country_id: number;
  end_city_id: number;
  end_address: string;
  end_station_id: number;

  created: string;
  updated: string;
  is_delete: false;
  main: true;
}

export interface TaskModel {
  id: number;
  country_name: string;
  city_name: string;
  not: string;
}
