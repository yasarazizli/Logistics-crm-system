import {
  OrderModel,
  OrderPackingModel,
  OrderTransportModel,
  RouteModel,
} from "@/features/dashboard/models/order.model.ts";

export const defaultServiceValue = {
  id: null,
  count: "0",
  selling_price: "0",
  buying_price: "1",
};

// Select Options Types
export const transportTypes = [
  {
    name: "Truck",
    value: "truck",
  },
  {
    name: "Plane",
    value: "plane",
  },
  {
    name: "Railway",
    value: "railway",
  },
  {
    name: "Filder",
    value: "filder",
  },
];

export const transitTypes = [
  {
    name: "İdxal",
    value: "İdxal",
  },
  {
    name: "İxrac",
    value: "İxrac",
  },
  {
    name: "Transit",
    value: "transit",
  },
  {
    name: "Daxili",
    value: "daxili",
  },
];

export const wagonTypes = [
  { name: "Covered Wagon", value: "covered_wagon" },
  { name: "Semi Wagon", value: "semi_wagon" },
  { name: "Open Top Wagon", value: "open_top_wagon" },
  { name: "Hopper Wagon", value: "hopper_wagon" },
  { name: "Cistern Wagon", value: "cistern_wagon" },
  { name: "Fitting Platform", value: "fitting_wagon" },
  { name: "Platform Wagon", value: "platform_wagon" },
];

export const truckTypes = [
  { name: "Ref Truck", value: "ref_truck" },
  { name: "Mega Truck", value: "mega_truck" },
  { name: "Tilt Truck", value: "tilt_truck" },
  { name: "Flat Truck", value: "flatbed_truck" },
  { name: "Lowbed Truck", value: "lowbed_truck" },
];

export const ownerTransportTypes = [
  { name: "Own transport", value: "SOC" },
  { name: "Company transport", value: "COC" },
];

export const weightTypes = [
  {
    name: "Kilogram(kg)",
    value: "kg",
  },
  {
    name: "Liter(l)",
    value: "l",
  },
];

export const sizeTypes = [
  { name: "10'", value: "s10" },
  { name: "20'", value: "s20" },
  { name: "30'", value: "s30" },
  { name: "40'", value: "s40" },
  { name: "45'", value: "s45" },
  { name: "20' tank", value: "s20_tank" },
  { name: "40' tank", value: "s40_tank" },
  { name: "10' ref", value: "s10_ref" },
  { name: "20' ref", value: "s20_ref" },
  { name: "40' ref", value: "s40_ref" },
  { name: "Bulk", value: "bulk" },
];

export const packingTypes = [
  { name: "Bag", value: "bag" },
  { name: "Big Bag", value: "big_bag" },
  { name: "Bulk", value: "bulk" },
  { name: "Drums", value: "drums" },
  { name: "FlexiTank", value: "flexi_tank" },
  { name: "Gas", value: "gas" },
  { name: "Liquid", value: "liquid" },
  { name: "Box", value: "box" },
  { name: "Wooden Crate", value: "wooden_crate" },
  { name: "IBC Tank", value: "ibc_tank" },
  { name: "Oversize Cargo", value: "oversize_cargo" },
  { name: "Pallet", value: "pallet" },
  { name: "Standard Container", value: "standard_container" },
  { name: "Ref Container", value: "ref_container" },
  { name: "Bulk Container", value: "bulk_container" },
  { name: "Open Top Container", value: "open_top_container" },
  { name: "Tank Container", value: "tank_container" },
  { name: "Flatrack Container", value: "flatrack_container" },
  { name: "ISO Container", value: "iso_container" },
];

export const expeditors = [
  {
    name: "Alliance Multimodal MMC",
    value: "alliance",
  },
  {
    name: "Caspian Rail MMC",
    value: "caspian",
  },
];

// -------------------New-------------------

// Default Route Value
export const defaultRouteValue: RouteModel = {
  // Route Id
  id: null,

  // Route isMain
  main: false,

  // Route Type
  type: "",

  // Route Transit Type
  transit: "",

  // Route Sequence Number
  priority: 0,

  // Route Transport
  transport: {
    type: "",
    width: "0",
    height: "0",
    length: "0",
    size: null,
    volume_type: "",
    volume_value: null,
    owner: "",
    count: null,
    codes: "",
  },

  // Route Packing
  packing: [
    {
      width: "0",
      height: "0",
      length: "0",
      type: "",
      volume: null,
      count: null,
      net_weight: null,
      gross_weight: null,
      weight_type: "",
      container_owner: "",
      container_count: null,
      container_codes: "",
      platform_owner: "",
      platform_type: "",
      platform_count: null,
      id: null,
      hs: [],
    },
  ],

  // Pad code
  pad_code: "",

  // Expeditor
  expeditor: "",

  // Route Start-End Country İd
  start_country_id: null,
  end_country_id: null,

  // Route Start-End City İd
  start_city_id: null,
  end_city_id: null,

  // Route Start-End Address
  start_address: "",
  end_address: "",

  // Route Start-End Station İd
  start_station_id: null,
  end_station_id: null,

  // Border Crossing Points Entry-Exit
  border_crossing_points_exit: "",
  border_crossing_points_entry: "",

  // Route Not
  note: "",
};

// Default Route Packing Value
export const defaultPackingValue: OrderPackingModel = {
  id: null,
  width: "0",
  height: "0",
  length: "0",
  type: "",
  volume: null,
  count: null,
  net_weight: null,
  gross_weight: null,
  weight_type: "",
  container_owner: "",
  container_count: null,
  container_codes: "",
  platform_owner: "",
  platform_type: "",
  platform_count: null,
  hs: [],
};

// Default Route Transport Value
export const defaultTransportValue: OrderTransportModel = {
  type: "",
  width: "0",
  height: "0",
  length: "0",
  size: null,
  volume_type: "",
  volume_value: null,
  owner: "",
  count: null,
  codes: "",
};

// Default Order Value
export const defaultOrderValue: OrderModel = {
  orderDetail: {
    services: [],
    routes: [
      // Main Route
      {
        // Route Id
        id: null,

        // Route isMain
        main: true,

        // Route Sequence Number
        priority: 0,

        transport: defaultTransportValue,

        // Route Start-End Country İd
        start_country_id: null,
        end_country_id: null,

        // Route Start-End City İd
        start_city_id: null,
        end_city_id: null,

        // Route Start-End Address
        start_address: "",
        end_address: "",

        // Route Start-End Station İd
        start_station_id: null,
        end_station_id: null,
      },
    ],
  },
  id: null,
  user: null,
  status: "",
  user_id: null,
  seller_id: null,
  start_time: "",
  end_time: "",
  shipper: "",
  receiver: "",
  note: "",
  deleted: {
    routes: [],
    packings: [],
    packing_hs_code: [],
    services: [],
  },
};
