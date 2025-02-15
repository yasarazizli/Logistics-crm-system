import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";

import Filter from "@/components/Filter/Filter.tsx";
import Table from "@/components/Table/Table.tsx";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TaskModel } from "@/features/dashboard/models/dashboard.model.ts";

import { usePageChanger } from "@/hooks/usePageChanger.ts";

import { tasksTableHeadersConstant } from "@/features/dashboard/constants/tableHeader.constant.tsx";
import { useTranslation } from "react-i18next";
import {
  getAllBuyerTasksRequest,
  getBuyerAcceptTaskRequest,
  getBuyerCompletedTaskRequest,
} from "@/features/dashboard/services/buyer.services.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import Tools from "@/components/Tools/Tools.tsx";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";

const Tasks = () => {
  // React
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Contexts
  const { setLoader } = useContext(LoaderContext);

  // Hooks
  const { page } = usePageChanger();

  // States
  const [pageHelper, setPageHelper] = useState<PageHelperStateType>({
    tabs: [],
    activeTab: 2,
    response: null,
    render: false,
  });

  // Functions
  const allBuyerTasks = async () => {
    setLoader(true);
    const { status, data } = await getAllBuyerTasksRequest(
      pageHelper.activeTab === 2
        ? ""
        : pageHelper.activeTab === 1
          ? "false"
          : "true",
    );
    if (status === 200) {
      setPageHelper((prevState) => ({
        ...prevState,
        response: data,
      }));
    }
    setLoader(false);
  };

  const buyerAcceptTask = async (servicesId: number) => {
    setLoader(true);
    const { status } = await getBuyerAcceptTaskRequest(servicesId);
    if (status === 200) {
      setPageHelper((prevState) => ({
        ...prevState,
        render: !prevState.render,
      }));
    }
    setLoader(false);
  };

  const buyerCompletedTask = async (servicesId: number) => {
    setLoader(true);
    const { status } = await getBuyerCompletedTaskRequest(servicesId);
    if (status === 200) {
      setPageHelper((prevState) => ({
        ...prevState,
        render: !prevState.render,
      }));
    }
    setLoader(false);
  };

  // useEffects
  useEffect(() => {
    allBuyerTasks().catch(() => {});
  }, [pageHelper.activeTab, pageHelper.render, page]);

  useEffect(() => {
    const tabs = [
      {
        name: t("tasks.tabs.one"),
        tab: 0,
        onClick: () => {
          navigate(`${location.pathname}?page=${1}`);
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 0,
          }));
        },
      },
      {
        name: t("tasks.tabs.two"),
        tab: 1,
        onClick: () => {
          navigate(`${location.pathname}?page=${1}`);
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 1,
          }));
        },
      },
      {
        name: t("tasks.tabs.three"),
        tab: 2,
        onClick: () => {
          navigate(`${location.pathname}?page=${1}`);
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 2,
          }));
        },
      },
    ];

    setPageHelper((prevState) => ({
      ...prevState,
      tabs: tabs,
    }));
  }, [i18n.language]);

  // Render Const
  const renderTableRow = (task: TaskModel) => {
    return (
      <>
        <td>{task.country_name}</td>
        <td>{task.city_name}</td>
        <td>{task.not}</td>
        {pageHelper.activeTab === 2 && (
          <td>
            <Tools
              isMore
              icons={[
                {
                  type: "add",
                  text: t("tasks.table.one"),
                  onClick: () => {
                    buyerAcceptTask(task.id).catch(() => {});
                  },
                },
              ]}
            />
          </td>
        )}
        {pageHelper.activeTab === 1 && (
          <td>
            <Tools
              isMore
              icons={[
                {
                  type: "add",
                  text: t("tasks.table.two"),
                  onClick: () => {
                    buyerCompletedTask(task.id).catch(() => {});
                  },
                },
              ]}
            />
          </td>
        )}
      </>
    );
  };

  return (
    <div className={styles.dashboard}>
      <Filter
        tabs={pageHelper.tabs}
        activeTabs={pageHelper.activeTab}
        onFilter={() => {}}
        onClear={() => {}}
      />

      <div className={styles.dashboard__table}>
        <Table
          dataCount={pageHelper.response?.page_count}
          tableRow={
            tasksTableHeadersConstant[i18n.language as string][
              pageHelper.activeTab as number
            ]
          }
        >
          {pageHelper.response?.tasks?.map((task: TaskModel, index: number) => (
            <tr
              key={`row_data_${index}`}
              className={styles.dashboard__table__row}
            >
              {renderTableRow(task)}
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default Tasks;
