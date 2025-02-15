import { useState } from "react";

interface BaseFilterInputs {
  [key: string]: {
    name: string;
    params: string;
    value: string;
  };
}

export const useFilterInputsChanger = (inputs: BaseFilterInputs) => {
  const [filterInputsData, setFilterInputsData] = useState<BaseFilterInputs>({
    ...inputs,
  });

  const resetFilterInputs = () => setFilterInputsData({ ...inputs });

  return {
    filterInputsData,
    setFilterInputsData,
    resetFilterInputs,
  };
};
