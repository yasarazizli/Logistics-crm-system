// Tasks
const tasksTableItemEn = ["Country", "City", "Note"];
const tasksTableItemAz = ["Ölkə", "Şəhər", "Qeyd"];
const tasksTableItemRu = ["Страна", "Город", "Заметка"];

export const tasksTableHeadersConstant: Record<
  string,
  [string[], string[], string[]]
> = {
  en: [tasksTableItemEn, tasksTableItemEn, tasksTableItemEn],
  az: [tasksTableItemAz, tasksTableItemAz, tasksTableItemAz],
  ru: [tasksTableItemRu, tasksTableItemRu, tasksTableItemRu],
} as const;

// --------------------- En Yeniler ---------------------

// Users
export const getUsersTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: [
      "Customer",
      "Email address",
      "Phone number",
      "Company name",
      "FIN",
      "Balance",
      "Contract document",
      "Contract validity date",
      "Commercial manager",
      "Financier",
      "Edit",
    ],
    az: [
      "Müştəri",
      "E-poçt ünvanı",
      "Nömrə",
      "Şirkət adı",
      "FIN",
      "Balans",
      "Müqavilə sənədi",
      "Müqavilənin qüvvədə olma tarixi",
      "Kommersiya meneceri",
      "Maliyyəçi",
      "Redaktə",
    ],
    ru: [
      "Клиент",
      "Адрес электронной почты",
      "Номер",
      "Название компании",
      "FIN",
      "Баланс",
      "Документ договора",
      "Срок действия договора",
      "Коммерческий менеджер",
      "Финансист",
      "Редактировать",
    ],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [0, 1, 2, 3, 4, 5, 8, 9, 10],
    ],
    lawyer: [
      [0, 1, 2, 3, 4, 6, 7, 10],
      [0, 1, 2, 3, 4, 6, 7, 10],
      [0, 1, 2, 3, 4, 10],
    ],
    manager: [[0, 1, 2, 3, 4, 5, 7, 8]],
    accountant: [[0, 1, 2, 3, 4, 5, 6, 7, 10]],
    commercial_directory: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;

  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
};

// Vendors
export const getVendorsTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: [
      "Vendor name",
      "Contract document",
      "Contract document date",
      "Contract document language",
      "Edit",
    ],
    az: [
      "Vendorun adı",
      "Müqavilə sənədi",
      "Müqavilə sənədinin tarixi",
      "Müqavilə sənədinin dili",
      "Redaktə",
    ],
    ru: [
      "Название вендора",
      "Документ договора",
      "Дата документа договора",
      "Язык документа договора",
      "Редактировать",
    ],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 4], [0]],
    lawyer: [[0, 1, 2, 3, 4], [0, 1, 2, 3, 4], [0]],
    buyer_manager: [
      [0, 1, 2, 3],
      [0, 1, 2, 3],
      [0, 4],
    ],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;

  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
};

// Services
export const getServicesTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: [
      "Vendor Name",
      "Services Name",
      "Row Cost",
      "Selling Price",
      "Contract Document",
      "Contract Document Date",
      "Contract Document Language",
      "Edit",
    ],
    az: [
      "Vendor adı",
      "Xidmət adı",
      "Alış qiyməti",
      "Satış qiyməti",
      "Müqavilə sənədi",
      "Müqavilə sənədinin tarixi",
      "Müqavilə sənədinin dili",
      "Redaktə et",
    ],
    ru: [
      "Название вендора",
      "Название услуги",
      "Цена покупки",
      "Цена продажи",
      "Документ договора",
      "Дата документа договора",
      "Язык документа договора",
      "Редактировать",
    ],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0]],
    commercial_directory: [
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7],
    ],
    lawyer: [[0, 1, 2, 3, 4, 5, 6, 7], [0, 1, 2, 3, 4, 5, 6, 7], [0]],
    buyer_manager: [
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 7],
    ],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;

  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
};

// Settings
export const getLocationTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: ["Id", "Name", "Code", "More"],
    az: ["Id", "Adı", "Code", "Daha çox"],
    ru: ["ИД", "Название", "Code", "Ещё"],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [
      [0, 1],
      [0, 1],
      [0, 1],
    ],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;

  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
};

// Orders
export const getOrdersTable = (
  activeTab: number,
  language: string,
  role: string,
): {
  header: string[];
  rows: number[];
} => {
  const headersByLanguage: Record<string, { id: number; name: string }[]> = {
    en: [
      { id: 0, name: "Order code" },
      { id: 1, name: "Customer" },
      { id: 2, name: "Phone number" },
      { id: 3, name: "Email address" },
      { id: 4, name: "Country of loading" },
      { id: 5, name: "Country of destination" },
      { id: 6, name: "Date" },
      { id: 7, name: "Status" },
      { id: 8, name: "Price" },
      { id: 9, name: "Balance" },
      { id: 10, name: "Credit limit" },
      { id: 11, name: "Debt" },
      { id: 12, name: "Final payment date" },
      { id: 13, name: "Manager" },
      { id: 14, name: "Order confirmation" },
      { id: 15, name: "Invoice document" },
      { id: 16, name: "Instruction document" },
      { id: 17, name: "User confirmation" },
      { id: 18, name: "Payment" },
      { id: 19, name: "Financial confirmation" },
      { id: 20, name: "Director confirmation" },
      { id: 21, name: "Edit" },
    ],
    az: [
      { id: 0, name: "Sifariş kodu" },
      { id: 1, name: "Müştəri" },
      { id: 2, name: "Telefon nömrəsi" },
      { id: 3, name: "Email ünvanı" },
      { id: 4, name: "Yükləmə ölkəsi" },
      { id: 5, name: "Təyinat ölkəsi" },
      { id: 6, name: "Tarix" },
      { id: 7, name: "Status" },
      { id: 8, name: "Qiymət" },
      { id: 9, name: "Balans" },
      { id: 10, name: "Kredit limiti" },
      { id: 11, name: "Borc" },
      { id: 12, name: "Son ödəniş tarixi" },
      { id: 13, name: "Menecer" },
      { id: 14, name: "Sifarişin təsdiqi" },
      { id: 15, name: "Faktura sənədi" },
      { id: 16, name: "Təlimat sənədi" },
      { id: 17, name: "İstifadəçi təsdiqi" },
      { id: 18, name: "Ödəniş" },
      { id: 19, name: "Maliyyə təsdiqi" },
      { id: 20, name: "Direktor təsdiqi" },
      { id: 21, name: "Düzəliş et" },
    ],
    ru: [
      { id: 0, name: "Код заказа" },
      { id: 1, name: "Клиент" },
      { id: 2, name: "Номер телефона" },
      { id: 3, name: "Адрес электронной почты" },
      { id: 4, name: "Страна загрузки" },
      { id: 5, name: "Страна назначения" },
      { id: 6, name: "Дата" },
      { id: 7, name: "Статус" },
      { id: 8, name: "Цена" },
      { id: 9, name: "Баланс" },
      { id: 10, name: "Кредитный лимит" },
      { id: 11, name: "Долг" },
      { id: 12, name: "Дата окончательного платежа" },
      { id: 13, name: "Менеджер" },
      { id: 14, name: "Подтверждение заказа" },
      { id: 15, name: "Счет-фактура" },
      { id: 16, name: "Инструкционный документ" },
      { id: 17, name: "Подтверждение пользователя" },
      { id: 18, name: "Оплата" },
      { id: 19, name: "Финансовое подтверждение" },
      { id: 20, name: "Подтверждение директора" },
      { id: 21, name: "Редактировать" },
    ],
  };
  const roleMappings: Record<string, number[][]> = {
    // Old
    commercial_directory: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    directory: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20]],
    // New
    admin: [
      [],
      [],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16, 21],
      [],
      [],
    ],
    user: [
      [0, 4, 5, 6, 7, 15, 16, 18],
      [0, 4, 5, 6, 7, 17],
      [0, 4, 5, 6, 7, 21],
      [],
      [],
    ],
    commercial_manager: [
      [],
      [],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 21],
      [],
      [],
    ],
    accountant: [
      [],
      [],
      [],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 19],
      [0, 1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 18],
    ],
    buyer_manager: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 21], [], []],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;
  return {
    header: selectedRoleMapping
      .map((index) => headers[index]?.name)
      .filter((name) => name !== undefined),
    rows: roleMappings[role]?.[activeTab],
  };
};

// Workers
export const getWorkersTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: ["Name", "Email address", "Phone number", "Edit"],
    az: ["Ad", "E-poçt ünvanı", "Nömrə", "Redaktə"],
    ru: ["Имя", "Адрес электронной почты", "Номер", "Редактировать"],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [
      [0, 1, 2, 3],
      [0, 1, 2, 3],
      [0, 1, 2, 3],
      [0, 1, 2, 3],
      [0, 1, 2, 3],
    ],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;

  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
};

// Balance Activities
export const getBalanceActivitiesTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: [
      "Customer",
      "Financier",
      "Date",
      "Əməliyyat",
      "Amount",
      "Note",
      "Document",
      "Edit",
    ],
    az: [
      "Müştəri",
      "Maliyyəçi",
      "Tarix",
      "Əməliyyat",
      "Məbləğ",
      "Qeyd",
      "Sənəd",
      "Redaktə",
    ],
    ru: [
      "Клиент",
      "Финансист",
      "Дата",
      "Əməliyyat",
      "Сумма",
      "Заметка",
      "Документ",
      "Редактировать",
    ],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [
      [0, 1, 2, 4, 5, 6, 7],
      [0, 2, 3, 4, 5, 6],
    ],
    accountant: [[0, 1, 2, 4, 5, 6, 7]],
    directory: [[0, 1, 2, 4, 5, 6, 7]],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;
  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
};
