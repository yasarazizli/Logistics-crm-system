import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    pages.push(1);
    if (leftSibling > 2) pages.push("...");

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (rightSibling < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return [...new Set(pages)];
  };

  return (
    <div className={styles.pagination}>
      {getPageNumbers().map((pg, idx) =>
        pg === "..." ? (
          <span key={idx} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(pg as number)}
            className={`${styles.pageButton} ${currentPage === pg ? styles.activePage : ""}`}
          >
            {pg}
          </button>
        ),
      )}
    </div>
  );
};

export default Pagination;
