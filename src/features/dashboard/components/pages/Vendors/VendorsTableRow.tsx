import { Link } from "react-router-dom";
import styles from "@/components/Table/Table.module.scss";
import { dateStringConverter } from "@/libs/date.ts";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import Tools from "@/components/Tools/Tools.tsx";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
import { DownloadIcon } from "@/assets/icons/shared.vectors.tsx";

const VendorsTableRow = ({
  vendor,
  activeTab,
  setModals,
}: {
  vendor: VendorModel;
  activeTab: number;
  setModals?: Dispatch<
    SetStateAction<{
      vendor_create: boolean;
      vendor_contract_verified: VendorModel | null;
      vendor_contract_deleted: VendorModel | null;
      vendor_contract_active: VendorModel | null;
    }>
  >;
}) => {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);

  const getToolsConfig = (vendor: VendorModel) => {
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
                  vendor_contract_verified: vendor,
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
            if (setModals) {
              setModals((prevState) => ({
                ...prevState,
                vendor_contract_deleted: vendor,
              }));
            }
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
            if (setModals) {
              setModals((prevState) => ({
                ...prevState,
                vendor_contract_active: vendor,
              }));
            }
          },
        },
      ];

      configs.push(...lawyerTools);
    }
    return configs;
  };

  return (
    <tr className={styles.table__row}>
      <td>{vendor.name}</td>
      {activeTab !== 2 && (
        <>
          <td>
            {vendor.contract ? (
              <Link
                className={styles.link}
                target="_blank"
                to={vendor.contract}
              >
                {t("shared.contract.name")} <DownloadIcon />
              </Link>
            ) : (
              "Müqavilə mövcud deyil."
            )}
          </td>
          <td>
            <p className={styles.date}>
              {`${(vendor.contract_start_date && dateStringConverter(`${vendor.contract_start_date}`)) || "-"} - ${(vendor.contract_end_date && dateStringConverter(`${vendor.contract_end_date}`)) || "-"}`}
            </p>
          </td>
          <td>{vendor.contract_language}</td>
        </>
      )}
      {getToolsConfig(vendor).length > 0 && (
        <td>
          <Tools isMore={false} icons={getToolsConfig(vendor)} />
        </td>
      )}
    </tr>
  );
};

export default VendorsTableRow;
