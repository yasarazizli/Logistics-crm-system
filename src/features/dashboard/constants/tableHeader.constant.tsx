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
    en: ["Id", "Name", "More"],
    az: ["Id", "Adı", "Daha çox"],
    ru: ["ИД", "Название", "Ещё"],
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
export const getOrdersTableHeaders = (
  activeTab: number,
  language: string,
  role: string,
): string[] => {
  const headersByLanguage: Record<string, string[]> = {
    en: [
      "Order code",
      "Customer",
      "Phone number",
      "Email address",
      "Country of loading",
      "Country of destination",
      "Date",
      "Status",
      "Price",
      "Balance",
      "Manager",
      "Edit",
      "Order confirmation",
      "Instruction document",
    ],
    az: [
      "Sifariş kodu",
      "Müştəri",
      "Nömrə",
      "E-poçt ünvanı",
      "Yükləmə ölkəsi",
      "Təyinat ölkəsi",
      "Tarix",
      "Status",
      "Qiymət",
      "Balans",
      "Menecer",
      "Redaktə",
      "Sifariş təsdiqi",
      "İnstruksiya sənədi",
    ],
    ru: [
      "Код заказа",
      "Клиент",
      "Номер",
      "Адрес электронной почты",
      "Страна отправления",
      "Страна назначения",
      "Дата",
      "Статус",
      "Цена",
      "Цена",
      "Менеджер",
      "Редактировать",
      "Подтверждение заказа",
      "Инструктивный документ",
    ],
  };

  const roleMappings: Record<string, number[][]> = {
    admin: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
    commercial_directory: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    directory: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
    commercial_manager: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 10]],
    buyer_manager: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 10]],
    accountant: [[], [], [0, 1, 2, 3, 4, 5, 6, 7, 8, 11]],
    user: [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11],
    ],
  };

  const selectedRoleMapping = roleMappings[role]?.[activeTab] || [];
  const headers = headersByLanguage[language] || headersByLanguage.en;
  return selectedRoleMapping.map((index) => headers[index]).filter(Boolean);
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

// Orders
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
