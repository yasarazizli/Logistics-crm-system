export type Roles =
  | "lawyer"
  | "accountant"
  | "buyer_manager"
  | "commercial_manager"
  | "commercial_director";

export interface WorkerModel {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: Roles;
  identity_number: string;
}
