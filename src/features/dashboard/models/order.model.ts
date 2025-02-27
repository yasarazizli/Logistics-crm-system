import React from "react";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";
import { HsCodeModel } from "@/models/station.model.ts";

export type OrderEditorProps = {
  order: OrderModel;
  setOrder: React.Dispatch<React.SetStateAction<OrderModel>>;
};

export interface orderServicesModel {
  id: number | null;
  key_id: string | null;
  service_id: number | null;
  vendor_name?: string | null;
  count: string | null;
  selling_price: string | null;
  buying_price: string | null;
}

export interface padCodeModel {
  id: number | null;
  name: string;
}

export interface orderDetailModel {
  routes: RouteModel[];
  services?: orderServicesModel[];
}

// Route Provider
export type RouteEditorNameTypes =
  | "type"
  | "start_country_id"
  | "start_city_id"
  | "start_address"
  | "end_country_id"
  | "end_city_id"
  | "end_address"
  | "note"
  | "transit"
  | "pad_code"
  | "border_crossing_points_exit"
  | "border_crossing_points_entry"
  | "expeditor";

export type TransportEditorNameTypes =
  | "type"
  | "width"
  | "height"
  | "length"
  | "size"
  | "volume_type"
  | "volume_value"
  | "owner"
  | "count"
  | "codes";

export type PackageEditorNameTypes =
  | "type"
  | "width"
  | "height"
  | "length"
  | "volume"
  | "count"
  | "net_weight"
  | "gross_weight"
  | "weight_type"
  | "container_owner"
  | "container_count"
  | "container_codes"
  | "platform_owner"
  | "platform_type"
  | "platform_count";

// -------------------New-------------------

// Route Packing Model
export interface OrderPackingModel {
  // Packing
  id: number | null;
  width: string;
  height: string;
  length: string;
  type: string;
  volume: number | null;
  count: number | null;
  net_weight: number | null;
  gross_weight: number | null;
  weight_type: string;
  container_owner: string;
  container_count: number | null;
  container_codes: string;
  platform_owner: string;
  platform_type: string;
  platform_count: number | null;
  // Hs
  hs: HsCodeModel[];
}

// Route Transport Model
export interface OrderTransportModel {
  type: string;
  width: string;
  height: string;
  length: string;
  size: number | null;
  volume_type: string;
  volume_value: number | null;
  owner: string;
  count: number | null;
  codes: string;
}

// Route Model
export interface RouteModel {
  // Route Id
  id: number | null;

  // Route isMain
  main: boolean | null;

  // Route Type
  type?: string;

  // Route Transit Type
  transit?: string;

  // Route Sequence Number
  priority: number;

  // Route Transport
  transport: OrderTransportModel;

  // Route Packing
  packing?: OrderPackingModel[];

  // Pad code
  pad_code?: string;

  // Expeditor
  expeditor?: string;

  // Route Start-End Country İd
  start_country_id: number | null;
  end_country_id: number | null;

  // Route Start-End City İd
  start_city_id: number | null;
  end_city_id: number | null;

  // Route Start-End Address
  start_address: string;
  end_address: string;

  // Route Start-End Station İd
  start_station_id: number | null;
  end_station_id: number | null;

  // Border Crossing Points Entry-Exit
  border_crossing_points_exit?: string;
  border_crossing_points_entry?: string;

  // Route Not
  note?: string;
}

// Order Model
export interface OrderModel {
  orderDetail: orderDetailModel;

  // Deyishdirdiyim Orderin Start Time
  start_time: string;
  end_time: string;
  note: string;

  // Order
  shipper: string;
  receiver: string;

  // Deyishmediyim Datalar
  id: number | null;
  user_id: number | null;
  user: UserModel | null;
  seller_id: number | null;
  status: string;

  // Menim Istifade etdiklerim
  deleted: {
    routes: number[];
    packings: number[];
    services: number[];
    packing_hs_code: { packing_id: number | null; hs: number[] }[];
  };
}

export interface OrdersModel {
  id: number;
  // ?
  type: string;

  full_name: string;
  phone: string;
  email: string;

  status: string;
  commercial_manager: string;
  created: string;

  seller: string;

  price: string;
  balance: string;
  credit_limit: number;
  last_payment_date: string;
  out_standing_amount: number;

  start_time: string | null;
  end_time: string | null;

  start_location: string | null;
  end_location: string | null;
}

export interface InvoiceModel {
  to: string;
  contractNo: string;
  date: string;
  email: string;
  invoice_is_valid: string;
  orderNo: number;
  other_conditions: string;
  payment_terms: string;
  phone: string;
  service: {
    amount: number;
    price: number;
    service: string;
    total: number;
  }[];
  tin: string;
}

export interface InstructionModel {
  qrafa_1: string;
  qrafa_2: string;
  qrafa_4: string;
  qrafa_5: string;
  qrafa_6: string;
  qrafa_7: string;
  qrafa_15: string;
  qrafa_22: string;
  qrafa_23: string;
  qrafa_25: string;
}
