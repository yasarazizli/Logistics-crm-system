import React, { useContext } from "react";
import styles from "./Table.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "@/contexts/ThemeContext.tsx";

const Table = ({
  tableRow,
  dataCount = 0,
  paginationCount = 10,
  noPagination,
  children,
}: {
  tableRow: string[] | undefined;
  dataCount?: number;
  paginationCount?: number;
  noPagination?: boolean;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = Number(queryParams.get("page")) || 1;

  const totalPage =
    Math.floor(dataCount / paginationCount) +
    Math.ceil((dataCount % paginationCount) / paginationCount);

  const pageChanger = (page: number) => {
    if (page > 0 && page <= totalPage)
      navigate(`${location.pathname}?page=${page}`);
  };

  return (
    <div className={`${styles.table} ${darkMode && styles.dark}`}>
      <div className={styles.table__box}>
        <table>
          <thead>
            <tr>
              {tableRow?.map((row, index) => (
                <th key={`table_row_${row}_${index}`}>{row}</th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>

      {!noPagination && totalPage > 1 && (
        <div className={styles.table__pagination}>
          <button
            className={styles.nav__button}
            onClick={() => pageChanger(Number(currentPage) - 1)}
            disabled={currentPage === 1}
          >
            <span>Previous</span>
          </button>

          <div className={styles.numbers}>
            {/* Sayfa numaralarını göster */}
            {Array.from({ length: totalPage }, (_, i) => {
              if (
                i === 0 || // İlk sayfa
                i === totalPage - 1 || // Son sayfa
                i === currentPage - 1 || // Aktif sayfanın bir öncesi
                i === currentPage || // Aktif sayfa
                i === currentPage + 1 // Aktif sayfanın bir sonrası
              ) {
                return (
                  <button
                    className={`${styles.pagination__item} ${currentPage === i + 1 ? styles.active : ""}`}
                    key={i}
                    onClick={() => pageChanger(i + 1)}
                  >
                    {i + 1}
                  </button>
                );
              }
              return null;
            })}
          </div>

          {/* Sonraki Sayfa Düğmesi */}
          <button
            className={styles.nav__button}
            onClick={() => pageChanger(Number(currentPage) + 1)}
            disabled={currentPage === totalPage}
          >
            <span>Next</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
