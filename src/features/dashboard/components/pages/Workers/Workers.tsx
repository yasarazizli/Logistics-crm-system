import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";
import { workerFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import WorkersTableRow from "@/features/dashboard/components/pages/Workers/WorkersTableRow.tsx";
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";
import Filter from "@/components/Filter/Filter.tsx";
import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";
import Table from "@/components/Table/Table.tsx";
import { getWorkersTableHeaders } from "@/features/dashboard/constants/tableHeader.constant.tsx";
import { getAllWorkersRequest } from "@/features/dashboard/services/workers.service.ts";
import { WorkerModel } from "@/features/dashboard/models/worker.model.ts";
import { Roles } from "@/features/dashboard/constants/enum.constant.tsx";
import DeleteWorker from "@/features/dashboard/components/shared/Modals/Workers/DeleteWorker.tsx";
import CreateWorker from "@/features/dashboard/components/shared/Modals/Workers/CreateWorker.tsx";
import UpdateWorker from "@/features/dashboard/components/shared/Modals/Workers/UpdateWorker.tsx";

const Workers = () => {
  // React
  const { page } = usePageChanger();
  const { t, i18n } = useTranslation();

  // Contexts
  const { setLoader } = useContext(LoaderContext);
  const { auth } = useContext(AuthContext);

  // Page Helper
  const [pageHelper, setPageHelper] = useState<PageHelperStateType>({
    response: null,
    render: false,
    tabs: [
      {
        name: "workers.tabs.one",
        tab: 0,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 0,
          }));
        },
      },
      {
        name: "workers.tabs.two",
        tab: 1,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 1,
          }));
        },
      },
      {
        name: "workers.tabs.three",
        tab: 2,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 2,
          }));
        },
      },
      {
        name: "workers.tabs.four",
        tab: 3,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 3,
          }));
        },
      },
      {
        name: "workers.tabs.five",
        tab: 4,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 4,
          }));
        },
      },
    ],
    activeTab: 0,
    buttons: [
      {
        title: "workers.buttons.create",
        onClick: () => {
          setModals((prevState) => ({
            ...prevState,
            create: true,
          }));
        },
      },
    ],
  });

  // Modals
  const [modals, setModals] = useState<{
    create: boolean;
    update: WorkerModel | null;
    delete: WorkerModel | null;
  }>({
    create: false,
    update: null,
    delete: null,
  });

  // Filter Inputs
  const { filterInputsData, setFilterInputsData, resetFilterInputs } =
    useFilterInputsChanger({ ...workerFilterConstants });

  // Get All User
  const getAllWorkers = async () => {
    setLoader(true);

    const { status, data } = await getAllWorkersRequest(
      page,
      10,
      filterInputsData.name.value,
      filterInputsData.email.value,
      filterInputsData.phone.value,
      Roles[pageHelper.activeTab],
    );

    if (status === 200) {
      setPageHelper((prevState) => ({
        ...prevState,
        response: data,
      }));
    }
    setLoader(false);
  };

  // Effects
  useEffect(() => {
    getAllWorkers().catch(() => {});
  }, [page, pageHelper.render, pageHelper.activeTab]);

  return (
    <>
      {/* Page Content START */}
      <div className={styles.dashboard}>
        <PageTitle title={t("workers.title")} />

        <Filter
          tabs={pageHelper.tabs}
          activeTabs={pageHelper.activeTab}
          buttons={pageHelper.buttons}
          onFilter={() => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
          }}
          onClear={() => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
            resetFilterInputs();
          }}
        >
          <FilterPopup
            inputsState={filterInputsData}
            setInputsState={setFilterInputsData}
          />
        </Filter>

        <div className={styles.dashboard__table}>
          <Table
            dataCount={pageHelper.response?.page_count}
            tableRow={getWorkersTableHeaders(
              pageHelper.activeTab,
              i18n.language,
              auth.role,
            )}
          >
            {pageHelper.response?.workers?.map(
              (worker: WorkerModel, index: number) => (
                <WorkersTableRow
                  key={`table_row_${index}`}
                  worker={worker}
                  setModals={setModals}
                />
              ),
            )}
          </Table>
        </div>
      </div>
      {/* Page Content END */}
      {/* ------------ Modals ------------ */}
      {/* Add Worker */}
      {modals.create && (
        <CreateWorker
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              create: false,
            }));
          }}
        />
      )}

      {/* Update Worker */}
      {modals.update && (
        <UpdateWorker
          worker={modals.update}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              update: null,
            }));
          }}
        />
      )}
      {/* Delete Worker */}
      {modals.delete && (
        <DeleteWorker
          worker={modals.delete}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              delete: null,
            }));
          }}
        />
      )}
    </>
  );
};

export default Workers;
