import styles from "@/features/dashboard/components/pages/OrderEditor/OrderDetail/OrderDetail.module.scss";

type SectionHeadProps = {
  icon?: any;
  size?: "s" | "m" | "l";
  name: string;
};

const SectionHead = ({ icon: Icon, name, size }: SectionHeadProps) => {
  return (
    <div
      className={`${styles.section__head} ${size === "s" ? styles.small : size === "m" ? styles.medium : styles.large}`}
    >
      {Icon && <Icon />}
      <p>{name}</p>
    </div>
  );
};

export default SectionHead;
