import styles from "./Table.module.scss";
import { ReactNode } from "react";

export interface Props {
  headers: { name: string }[];
  filters?: ReactNode;
  children?: ReactNode;
}

const Table = ({ headers, filters, children }: Props) => {
  return (
    <div className={styles.table}>
      <table>
        <thead>
          <tr>
            {headers.map((h, index) => (
              <th
                key={`table__head_${index}`}
                className={`${h.name === "" ? styles.small : ""}`}
              >
                <span>{h.name}</span>
              </th>
            ))}
          </tr>
          {filters && <tr className={styles.filter}>{filters}</tr>}
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
