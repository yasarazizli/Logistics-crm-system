import styles from "@/features/dashboard/components/shared/PageTitle/PageTitle.module.scss";

const PageTitle = ({ title }: { title: string }) => {
  return (
    <div className={styles.page__title}>
      <p className={styles.title}>{title}</p>
    </div>
  );
};

export default PageTitle;
