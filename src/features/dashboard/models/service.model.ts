export interface ServiceModel {
  key_id: string;
  id: number;
  name: string;
  raw_cost: number;
  selling_price: number;
  contract: string;
  contract_start_date: string;
  contract_end_date: string;
  contract_language: string;
  vendor: {
    id: number;
    name?: string;
  };
  city: {
    Country: {
      ID: number;
      name: string;
      updated: string;
      created: string;
    };
    ID: number;
    country_id: number;
    name: string;
    updated: string;
    created: string;
  };
}
