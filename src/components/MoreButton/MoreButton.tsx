import React, { useEffect, useRef, useState } from "react";
import styles from "./MoreButton.module.scss";
import useClickOutside from "../../hooks/useClickOutside.ts";
import { MoreIcon } from "@/assets/icons/shared.vectors.tsx";

const MoreButton = ({ children }: { children?: React.ReactNode }) => {
  const [active, setActive] = useState(false);
  const boxRef = useRef<HTMLTableDataCellElement>(null);
  const clickedInside = useClickOutside(boxRef);

  useEffect(() => {
    if (!clickedInside) {
      setActive(false);
    }
  }, [clickedInside]);

  return (
    <div className={styles.menu}>
      <div
        className={styles.menu__button}
        onClick={() => {
          setActive((prevState) => {
            return !prevState;
          });
        }}
      >
        <MoreIcon />
      </div>
      {active && (
        <div
          className={styles.menu__actions}
          ref={boxRef}
          onClick={() => {
            setActive(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default MoreButton;
