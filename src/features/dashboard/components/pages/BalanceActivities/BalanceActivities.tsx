import Filter from "@/components/Filter/Filter.tsx";
import Table from "@/components/Table/Table.tsx";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";
import { balanceActivitiesFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";
import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";
import { InvoicesModel } from "@/features/dashboard/models/balanceActivities.model.ts";
import { getBalanceActivitiesTableHeaders } from "@/features/dashboard/constants/tableHeader.constant.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useTranslation } from "react-i18next";
import BalanceActivitiesTableRow from "@/features/dashboard/components/pages/BalanceActivities/BalanceActivitiesTableRow.tsx";

import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import { InvoiceStatus } from "@/features/dashboard/constants/enum.constant.tsx";
import { getUserBalanceActivitiesRequest } from "@/features/dashboard/services/balance.service.ts";

const BalanceActivities = () => {
  const { i18n } = useTranslation();
  const { auth } = useContext(AuthContext);
  const { setLoader } = useContext(LoaderContext);

  const { page } = usePageChanger();

  const { filterInputsData, setFilterInputsData } = useFilterInputsChanger({
    ...balanceActivitiesFilterConstants,
  });

  const [pageHelper, setPageHelper] = useState<PageHelperStateType>({
    response: null,
    render: false,
    tabs: [
      //  Balance Artirmaq ucun gelen sorgular
      ...(["admin", "accountant"].includes(auth.role)
        ? [
            {
              name: "users.tabs.two",
              tab: 0,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 0,
                }));
              },
            },
          ]
        : []),
      //  Balance Logu
      ...(["admin"].includes(auth.role)
        ? [
            {
              name: "users.tabs.one",
              tab: 1,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 1,
                }));
              },
            },
          ]
        : []),
    ],
    activeTab: 0,
  });

  // get Balance Activities
  const getBalanceActivities = async () => {
    setLoader(true);
    console.log(InvoiceStatus[pageHelper.activeTab]);
    const { status, data } = await getUserBalanceActivitiesRequest(
      page,
      10,
      "",
      InvoiceStatus[pageHelper.activeTab],
      filterInputsData.name.value,
      filterInputsData.amount_min.value,
      filterInputsData.amount_max.value,
      filterInputsData.start_date.value,
      filterInputsData.end_date.value,
    );
    if (status === 200) {
      setPageHelper((prevState) => ({
        ...prevState,
        response: data,
      }));
      setLoader(false);
    }
  };

  useEffect(() => {
    getBalanceActivities().catch(() => {});
  }, [page, pageHelper.render, pageHelper.activeTab]);

  return (
    <>
      <div className={styles.dashboard}>
        <Filter
          tabs={pageHelper.tabs}
          activeTabs={pageHelper.activeTab}
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
            setFilterInputsData({ ...balanceActivitiesFilterConstants });
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
            tableRow={getBalanceActivitiesTableHeaders(
              pageHelper.activeTab,
              i18n.language,
              auth.role,
            )}
          >
            {pageHelper.response?.invoices?.map(
              (invoice: InvoicesModel, index: number) => (
                <BalanceActivitiesTableRow
                  key={`table_row_${index}${invoice.id}`}
                  invoice={invoice}
                  activeTab={pageHelper.activeTab}
                  render={() => {
                    setPageHelper((prevState) => ({
                      ...prevState,
                      render: !prevState.render,
                    }));
                  }}
                />
              ),
            )}
          </Table>
        </div>
      </div>
    </>
  );
};

export default BalanceActivities;
