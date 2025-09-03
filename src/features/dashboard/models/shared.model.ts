import { TaskModel, UserModel } from "./dashboard.model.ts";
import { OrdersModel } from "@/features/dashboard/models/order.model.ts";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
import { WorkerModel } from "@/features/dashboard/models/worker.model.ts";
import { InvoicesModel } from "@/features/dashboard/models/balanceActivities.model.ts";

export interface PageTabsModel {
  name: string;
  tab: number;
  onClick?: () => void;
}

export type ModalType = {
  manager?: number | null;
  balance?: number | null;
  verified?: number | null;
  unverified?: number | null;
  create?: number | null;
  add?: boolean;
};

export type CountriesModel = { id: number; name: string };
export type CitiesModel = { id: number; name: string };
export type StationsModel = { id: number; name: string; code?: string };

export interface TableResponseType {
  page_count: number;
  // News
  users?: UserModel[];
  vendors?: VendorModel[];
  workers?: WorkerModel[];
  orders?: OrdersModel[];
  invoices?: InvoicesModel[];

  // Olds
  tasks?: TaskModel[];
  countries?: CountriesModel[];
  cities?: CitiesModel[];
  stations?: StationsModel[];
}

// News
export interface PageHelperStateType {
  response: TableResponseType | null;
  render: boolean;
  tabs: PageTabsModel[];
  activeTab: number;
  buttons?: {
    title: string;
    onClick: () => void;
  }[];
}
