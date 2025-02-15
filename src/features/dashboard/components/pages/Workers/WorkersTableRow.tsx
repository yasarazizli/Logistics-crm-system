import styles from "@/components/Table/Table.module.scss";
import { WorkerModel } from "@/features/dashboard/models/worker.model.ts";
import { Dispatch, SetStateAction } from "react";
import Tools from "@/components/Tools/Tools.tsx";
import { useTranslation } from "react-i18next";

const WorkersTableRow = ({
  worker,
  setModals,
}: {
  worker: WorkerModel;
  setModals?: Dispatch<
    SetStateAction<{
      create: boolean;
      update: WorkerModel | null;
      delete: WorkerModel | null;
    }>
  >;
}) => {
  const { t } = useTranslation();

  return (
    <tr className={styles.table__row}>
      {/* Main User Info */}
      <td>{worker.full_name}</td>
      <td>{worker.email}</td>
      <td>{worker.phone}</td>
      <td>
        <div className={styles.set}>
          <Tools
            isMore={false}
            icons={[
              {
                type: "refresh",
                onClick: () => {
                  if (setModals) {
                    setModals((prevState) => ({
                      ...prevState,
                      update: worker,
                    }));
                  }
                },
                text: t("workers.buttons.update"),
              },
              {
                type: "delete",
                onClick: () => {
                  if (setModals) {
                    setModals((prevState) => ({
                      ...prevState,
                      delete: worker,
                    }));
                  }
                },
                text: t("workers.buttons.delete"),
              },
            ]}
          />
        </div>
      </td>
    </tr>
  );
};

export default WorkersTableRow;
