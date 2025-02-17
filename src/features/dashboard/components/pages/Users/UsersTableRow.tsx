import React, { Dispatch, SetStateAction, useContext } from "react";
import styles from "@/components/Table/Table.module.scss";
import Tools from "@/components/Tools/Tools.tsx";
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { dateStringConverter } from "@/libs/date.ts";
import { DownloadIcon } from "@/assets/icons/shared.vectors.tsx";
import { UserModalsProps } from "@/features/dashboard/components/pages/Users/Users.tsx";

interface TableRenderRowProps {
  user: UserModel;
  setModals?: Dispatch<SetStateAction<UserModalsProps>>;
  activeTab: number;
}

const UsersTableRow: React.FC<TableRenderRowProps> = ({
  user,
  setModals,
  activeTab,
}) => {
  const { t } = useTranslation();

  // Render Constants
  const renderUserDetails = () => {
    return (
      <>
        <td>{user.full_name}</td>
        <td>{user.email}</td>
        <td>{user.phone}</td>
        <td>{user.company_name}</td>
        <td>{user.identity_number}</td>
      </>
    );
  };
  const renderContractDetails = () => {
    if (activeTab !== 2) {
      return (
        <>
          <td>
            {user.contract ? (
              <Link className={styles.link} target="_blank" to={user.contract}>
                {t("shared.contract.name")} <DownloadIcon />
              </Link>
            ) : (
              "Müqavilə mövcud deyil."
            )}
          </td>
          <td>
            <p className={styles.date}>
              {`${(user.contract_start_date && dateStringConverter(`${user.contract_start_date}`)) || "-"} - ${(user.contract_end_date && dateStringConverter(`${user.contract_end_date}`)) || "-"}`}
            </p>
          </td>
        </>
      );
    }
    return null;
  };
  const getToolsConfig = () => {
    const configs = [];

    if (["admin"].includes(auth.role)) {
      configs.push({
        type: "refresh",
        text: "User Edit",
        onClick: () => {
          if (setModals) {
            setModals((prevState) => ({
              ...prevState,
              update: user,
            }));
          }
        },
      });
    }

    if (["admin", "accountant"].includes(auth.role)) {
      configs.push({
        type: "add",
        text: "Balans əməliyyatı",
        onClick: () => {
          if (setModals) {
            setModals((prevState) => ({
              ...prevState,
              balance_sheet_transaction: user.id,
            }));
          }
        },
      });
    }

    if (["admin", "lawyer"].includes(auth.role) && [0, 1].includes(activeTab)) {
      const config = [
        ...(activeTab === 1
          ? [
              {
                type: "add",
                text: t("shared.contract.verified"),
                onClick: () => {
                  if (setModals) {
                    setModals((prevState) => ({
                      ...prevState,
                      contract_verification: user.id,
                    }));
                  }
                },
              },
            ]
          : []),
        {
          type: "delete",
          text: t("shared.contract.delete"),
          onClick: () => {
            if (setModals) {
              setModals((prevState) => ({
                ...prevState,
                contract_delete: user.id,
              }));
            }
          },
        },
      ];

      configs.push(...config);
    }

    if (["admin", "lawyer"].includes(auth.role) && [2].includes(activeTab)) {
      configs.push({
        type: "add",
        text: t("shared.contract.add"),
        onClick: () => {
          if (setModals) {
            setModals((prevState) => ({
              ...prevState,
              contract_add: user.id,
            }));
          }
        },
      });
    }

    if (["admin"].includes(auth.role)) {
      configs.push({
        type: "delete",
        text: "Delete User",
        onClick: () => {
          if (setModals) {
            setModals((prevState) => ({
              ...prevState,
              delete: user,
            }));
          }
        },
      });
    }

    return configs;
  };

  const { auth } = useContext(AuthContext);

  return (
    <tr className={styles.table__row}>
      {/* Main User Info */}
      {renderUserDetails()}

      {/* Balance */}
      {["admin", "commercial_directory", "accountant", "buyers"].includes(
        auth.role,
      ) && <td>$ {user.balance}</td>}

      {/* Contract Detail */}
      {["admin", "commercial_directory", "accountant", "lawyer"].includes(
        auth.role,
      ) && <>{renderContractDetails()}</>}

      {["admin", "commercial_directory"].includes(auth.role) && (
        <td>
          <div className={styles.set}>
            <Tools
              isMore
              icons={[
                {
                  type: user?.commercial_manager ? "refresh" : "add",
                  onClick: () => {
                    if (setModals) {
                      setModals((prevState) => ({
                        ...prevState,
                        appoint_commercial_manager: user.id,
                      }));
                    }
                  },
                  text: user?.commercial_manager
                    ? `${user?.commercial_manager}`
                    : t("shared.buttons.manager"),
                },
              ]}
            />
          </div>
        </td>
      )}

      {/* Accountant */}
      {["admin", "commercial_directory"].includes(auth.role) && (
        <td>
          <div className={styles.set}>
            <Tools
              isMore
              icons={[
                {
                  type: user?.accountant ? "refresh" : "add",
                  onClick: () => {
                    if (setModals) {
                      setModals((prevState) => ({
                        ...prevState,
                        appoint_accountant: user.id,
                      }));
                    }
                  },
                  text: user?.accountant
                    ? `${user?.accountant}`
                    : t("shared.buttons.accountant"),
                },
              ]}
            />
          </div>
        </td>
      )}

      {/* More Button */}
      {getToolsConfig().length > 0 && (
        <td>
          <Tools isMore={false} icons={getToolsConfig()} />
        </td>
      )}
    </tr>
  );
};

export default UsersTableRow;
