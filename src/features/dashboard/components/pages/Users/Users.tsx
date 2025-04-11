// React
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Types
import { UserModel } from "@/features/dashboard/models/dashboard.model.ts";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";

// Constants
import { ContractStatus } from "@/features/dashboard/constants/enum.constant.tsx";
import { getUsersTableHeaders } from "@/features/dashboard/constants/tableHeader.constant.tsx";

// Contexts & Hooks & Request
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";
import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { getAllUsersRequest } from "@/features/dashboard/services/user.service.ts";

// Components
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";
import Table from "@/components/Table/Table.tsx";
import UsersTableRow from "@/features/dashboard/components/pages/Users/UsersTableRow.tsx";
import Filter from "@/components/Filter/Filter.tsx";
import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";

// Styles
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import { userFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import UserModals from "@/features/dashboard/components/pages/Users/UserModals.tsx";

export interface UserModalsProps {
  create: boolean;
  update: UserModel | null;
  delete: UserModel | null;
  appoint_accountant: number | null;
  appoint_commercial_manager: number | null;
  contract_add: number | null;
  contract_verification: number | null;
  contract_delete: number | null;
  balance_sheet_transaction: number | null;
}

const Users = () => {
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
      ...(["admin", "lawyer", "accountant"].includes(auth.role)
        ? [
            {
              name: "shared.tabs.one",
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
      ...(["admin", "lawyer"].includes(auth.role)
        ? [
            {
              name: "shared.tabs.two",
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
      ...(["admin", "lawyer"].includes(auth.role)
        ? [
            {
              name: "shared.tabs.three",
              tab: 2,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 2,
                }));
              },
            },
          ]
        : []),
    ],
    activeTab: 0,
    buttons: [
      {
        title: "users.buttons.create",
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
  const [modals, setModals] = useState<UserModalsProps>({
    appoint_accountant: null,
    appoint_commercial_manager: null,
    contract_add: null,
    contract_verification: null,
    contract_delete: null,
    balance_sheet_transaction: null,
    create: false,
    update: null,
    delete: null,
  });

  // Filter Inputs
  const { filterInputsData, setFilterInputsData, resetFilterInputs } =
    useFilterInputsChanger({ ...userFilterConstants });

  // Get All User
  const getAllUsers = async () => {
    setLoader(true);

    const contractStatus = ["admin", "lawyer"].includes(auth.role)
      ? ContractStatus[pageHelper.activeTab]
      : ["commercial_directory"].includes(auth.role)
        ? "all"
        : "verified";

    const { status, data } = await getAllUsersRequest(
      page,
      10,
      filterInputsData.name.value,
      filterInputsData.email.value,
      filterInputsData.phone.value,
      filterInputsData.identity_number.value,
      filterInputsData.company_name.value,
      filterInputsData.manager.value,
      filterInputsData.start_date.value,
      filterInputsData.end_date.value,
      contractStatus,
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
    getAllUsers().catch(() => {});
  }, [page, pageHelper.render, pageHelper.activeTab]);

  useEffect(() => {
    console.log(innerHeight - 70 - 124);
  }, []);

  return (
    <>
      {/* Page Content START */}
      <div className={styles.dashboard}>
        <PageTitle title={t("users.title")} />

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
            tableRow={getUsersTableHeaders(
              pageHelper.activeTab,
              i18n.language,
              auth.role,
            )}
          >
            {pageHelper.response?.users?.map(
              (user: UserModel, index: number) => (
                <UsersTableRow
                  key={`table_row_${index}${user.id}`}
                  user={user}
                  setModals={setModals}
                  activeTab={pageHelper.activeTab}
                />
              ),
            )}
          </Table>
        </div>
      </div>
      {/* Page Content END */}

      {/* ------------ Modals ------------ */}
      <UserModals
        modals={modals}
        setModals={setModals}
        setPageHelper={setPageHelper}
      />
      {/* --------------------------------- */}
    </>
  );
};

export default Users;
