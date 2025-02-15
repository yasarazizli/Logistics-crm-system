import { InvoicesModel } from "@/features/dashboard/models/balanceActivities.model.ts";
import styles from "@/components/Table/Table.module.scss";
import { Link } from "react-router-dom";
import Tools from "@/components/Tools/Tools.tsx";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { DownloadIcon } from "@/assets/icons/shared.vectors.tsx";
import { getAccountantApprovedRequest } from "@/features/dashboard/services/balance.service.ts";

const BalanceActivitiesTableRow = ({
  invoice,
  activeTab,
  render,
}: {
  invoice: InvoicesModel;
  activeTab: number;
  render: () => void;
}) => {
  const { auth } = useContext(AuthContext);

  const getAccountantApproved = async (id: number, approve: boolean) => {
    const { status, data } = await getAccountantApprovedRequest(id, approve);
    if (status === 200) toast.success(errorMessageHandler(data));
    else toast.error(errorMessageHandler(data));
  };

  console.log(activeTab);

  return (
    <tr className={styles.table__row}>
      <td>{invoice.user}</td>
      {activeTab == 0 && <td>{invoice.accountant || "- - -"}</td>}
      <td>{invoice.created}</td>
      {activeTab == 1 && <td>{invoice.type}</td>}
      <td>{invoice.amount}</td>
      <td>{invoice.not || "- - -"}</td>
      <td>
        <Link
          className={styles.link}
          target="_blank"
          to={invoice.document}
        >
          Sənəd <DownloadIcon />
        </Link>
      </td>
      {["admin", "accountant"].includes(auth.role) && activeTab === 0 && (
        <td>
          <Tools
            isMore
            icons={[
              {
                type: "approve",
                onClick: async () => {
                  await getAccountantApproved(invoice.id, true);
                  render();
                },
              },
              {
                type: "reject",
                onClick: async () => {
                  await getAccountantApproved(invoice.id, false);
                  render();
                },
              },
            ]}
          />
        </td>
      )}
    </tr>
  );
};

export default BalanceActivitiesTableRow;
