import React from "react";

// Styles
import styles from "@/components/Switcher/Switcher.module.scss";

const Switcher = ({
  iconOne: IconOne,
  iconTwo: IconTwo,
  toggle,
  onToggle,
}: {
  iconOne: React.ElementType;
  iconTwo: React.ElementType;
  toggle: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className={styles.switcher}>
      <div
        onClick={onToggle}
        className={`${styles.switcher__icon} ${toggle && styles.active}`}
      >
        {IconOne && <IconOne />}
      </div>
      <div
        onClick={onToggle}
        className={`${styles.switcher__icon} ${!toggle && styles.active}`}
      >
        {IconTwo && <IconTwo />}
      </div>
    </div>
  );
};

export default Switcher;
