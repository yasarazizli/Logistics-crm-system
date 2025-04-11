import { Link } from "react-router-dom";
import styles from "@/components/Table/Table.module.scss";
import { dateStringConverter } from "@/libs/date.ts";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";
import { Dispatch, SetStateAction, useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import Tools from "@/components/Tools/Tools.tsx";
import { DownloadIcon } from "@/assets/icons/shared.vectors.tsx";
import { Roles } from "@/features/dashboard/constants/enum.constant.tsx";

const ServicesTableRow = ({
  service,
  activeTab,
  setModals,
}: {
  service: ServiceModel;
  activeTab: number;
  setModals: Dispatch<
    SetStateAction<{
      service_create: boolean;
      service_contract_verified: ServiceModel | null;
      service_contract_deleted: ServiceModel | null;
      service_selling_price: ServiceModel | null;
      service_monitoring_pending: ServiceModel | null;
    }>
  >;
}) => {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);

  const getToolsConfig = (service: ServiceModel) => {
    const configs = [];

    if (["admin", "lawyer"].includes(auth.role) && [0, 1].includes(activeTab)) {
      const lawyerTools = [
        ...((activeTab === 1 && [
          {
            type: "add",
            text: t("shared.contract.add"),
            onClick: () => {
              if (setModals) {
                setModals((prevState) => ({
                  ...prevState,
                  service_contract_verified: service,
                }));
              }
            },
          },
        ]) ||
          []),
        {
          type: "delete",
          text: t("shared.contract.delete"),
          onClick: () => {
            setModals((prevState) => ({
              ...prevState,
              service_contract_deleted: service,
            }));
          },
        },
      ];

      configs.push(...lawyerTools);
    }

    if (["buyer_manager"].includes(auth.role) && [2].includes(activeTab)) {
      const lawyerTools = [
        {
          type: "refresh",
          text: "Müqaviləni yenilə",
          onClick: () => {
            setModals((prevState) => ({
              ...prevState,
              service_contract_deleted: service,
            }));
          },
        },
      ];

      configs.push(...lawyerTools);
    }

    return configs;
  };

  return (
    <tr className={styles.table__row}>
      <td>{service.vendor.name}</td>
      <td>{service.name}</td>

      <td>{service.raw_cost}</td>
      <td>{service.selling_price}</td>

      <td>
        <Link className={styles.link} target={"_blank"} to={service.contract}>
          {t("shared.contract.name")} <DownloadIcon />
        </Link>
      </td>
      <td>{dateStringConverter(service.contract_end_date)}</td>

      <td>{service.contract_language}</td>

      {["commercial_directory"].includes(auth.role) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "add",
                onClick: () => {
                  setModals((prevState) => ({
                    ...prevState,
                    service_selling_price: service,
                  }));
                },
                text: "Qiymət Təyin et",
              },
            ]}
          />
        </td>
      )}

      {[Roles.monitoring].includes(auth.role as Roles) && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "approve",
                onClick: () => {
                  setModals((prevState) => ({
                    ...prevState,
                    service_monitoring_pending: service,
                  }));
                },
              },
              {
                type: "reject",
                onClick: () => {},
              },
            ]}
          />
        </td>
      )}

      {getToolsConfig(service).length > 0 && (
        <td>
          <Tools isMore={false} icons={getToolsConfig(service)} />
        </td>
      )}
    </tr>
  );
};

export default ServicesTableRow;
