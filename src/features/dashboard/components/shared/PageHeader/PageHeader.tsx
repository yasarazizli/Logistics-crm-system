import styles from "./PageHeader.module.scss";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import AddContract from "@/features/dashboard/components/shared/Modals/Users/Contract/AddContract.tsx";
import AddBalance from "@/features/dashboard/components/shared/Modals/Users/Balance/AddBalance.tsx";

const PageHeader = ({ title }: { title: string }) => {
  const { auth } = useContext(AuthContext);
  const [modals, setModals] = useState({
    addContract: false,
    addBalance: false,
  });

  const renderContractStatus = () => {
    const { contract_status, contract } = auth.user || {};

    switch (contract_status) {
      case 0:
        return (
          <div>
            <span>No contract:</span>{" "}
            <a
              onClick={() =>
                setModals((prevState) => ({
                  ...prevState,
                  addContract: true,
                }))
              }
            >
              [ Müqavilə Yükləyin ]
            </a>
          </div>
        );

      case 1:
        return (
          <div>
            <span>Contract:</span>{" "}
            <a href={`${contract}`} target="_blank" rel="noopener noreferrer">
              [ Müqavilə Təsdiqlənmə gözləyir ]
            </a>
          </div>
        );

      case 2:
        return (
          <div>
            <span>Contract:</span>{" "}
            <a href={`${contract}`} target="_blank" rel="noopener noreferrer">
              [ Müqavilə Təsdiqlənib ]
            </a>
          </div>
        );
    }
  };

  return (
    <>
      <div className={styles.page__header}>
        <p className={styles.page__header__title}>{title}</p>
        <div className={styles.page__header__info}>
          <div className={styles.page__header__info__item}>
            <p>
              Balance: <span>{auth.user?.balance} AZN</span>
            </p>
            <a
              onClick={() => {
                setModals((prevState) => ({
                  ...prevState,
                  addBalance: true,
                }));
              }}
            >
              [ Add payment ]
            </a>
          </div>
          <div className={styles.page__header__info__item}>
            {renderContractStatus()}
          </div>
        </div>
      </div>

      {modals.addContract && (
        <AddContract
          id={Number(auth?.user?.id)}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              addContract: false,
            }));
          }}
        />
      )}

      {modals.addBalance && (
        <AddBalance
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              addBalance: false,
            }));
          }}
        />
      )}
    </>
  );
};

export default PageHeader;
