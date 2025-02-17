const Months: { [key: string]: string } = {
  "1": "Yanvar",
  "2": "Fevral",
  "3": "Mart",
  "4": "Aprel",
  "5": "May",
  "6": "Iyun",
  "7": "Iyul",
  "8": "Avqust",
  "9": "Sentyabr",
  "10": "Oktyabr",
  "11": "Noyabr",
  "12": "Dekabr",
};

export const dateStringConverter = (date: string) => {
  const datetime = new Date(date);
  const jsonDate = {
    day: datetime.getDate(),
    month: datetime.getMonth() + 1,
    year: datetime.getFullYear(),
  };

  return `${jsonDate.day} ${Months[jsonDate.month]} ${jsonDate.year}`;
};

export const dateToInputFormat = (date: string) => {
  if (
    !navigator.userAgent.includes("Chrome") &&
    navigator.userAgent.includes("Safari")
  ) {
    let jDate = date.split("-");
    date = `${jDate[2]}-${jDate[0]}-${jDate[1]}`;
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    // Geçersiz tarih
    return "";
  }

  return new Date(parsedDate.setHours(5)).toISOString().split("T")[0];
};

export const getDateObject = (date: string) => {
  if (
    !navigator.userAgent.includes("Chrome") &&
    navigator.userAgent.includes("Safari")
  ) {
    let jDate = date.split("-");
    date = `${jDate[2]}-${jDate[0]}-${jDate[1]}`;
  }

  const nDate = new Date(date);

  return {
    day: `${nDate.getDate()}`.padStart(2, "0"),
    month: `${nDate.getMonth() + 1}`.padStart(2, "0"),
    year: nDate.getFullYear(),
  };
};

// Date
export const handleStartDateChange = (inputsRef: any) => {
  if (inputsRef.contract_end_date?.current) {
    inputsRef.contract_end_date.current.value = "";
  }
};

export const getEndDateMinValue = (inputsRef: any): string => {
  const startDateValue = inputsRef.contract_start_date?.current?.value || "";
  return startDateValue
    ? dateToInputFormat(new Date(startDateValue).toISOString())
    : dateToInputFormat(new Date().toISOString());
};
