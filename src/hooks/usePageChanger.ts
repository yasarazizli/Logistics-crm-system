import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const usePageChanger = () => {
  const { search } = useLocation();

  const [page, setPage] = useState<number>(
    Number(new URLSearchParams(search).get("page")) || 1,
  );

  const changePage = () => {
    setPage(Number(new URLSearchParams(search).get("page")) || 1);
  };

  useEffect(() => {
    changePage();
  }, [search]);

  return {
    page,
    changePage,
  };
};
