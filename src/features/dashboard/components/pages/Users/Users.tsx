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
import AppointAccountant from "@/features/dashboard/components/shared/Modals/Users/Appointment/AppointAccountant.tsx";
import AppointCommercialManager from "@/features/dashboard/components/shared/Modals/Users/Appointment/AppointCommercialManager.tsx";
import ContractVerification from "@/features/dashboard/components/shared/Modals/Users/Contract/ContractVerification.tsx";
import ContractDelete from "@/features/dashboard/components/shared/Modals/Users/Contract/ContractDelete.tsx";
import BalanceTransaction from "@/features/dashboard/components/shared/Modals/Users/Balance/BalanceTransaction.tsx";

// Styles
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import { userFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import AddContract from "@/features/dashboard/components/shared/Modals/Users/Contract/AddContract.tsx";
import UserModals from "@/features/dashboard/components/shared/Modals/Users/User/UserModals.tsx";

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

      {/* Add Contract */}

      {modals.contract_add !== null && (
        <AddContract
          id={modals.contract_add}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              contract_add: null,
            }));
          }}
        />
      )}

      {/* Contract Verification */}
      {modals.contract_verification !== null && (
        <ContractVerification
          id={modals.contract_verification}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              contract_verification: null,
            }));
          }}
        />
      )}

      {/* Contract Delete */}
      {modals?.contract_delete !== null && (
        <ContractDelete
          id={modals.contract_delete}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              contract_delete: null,
            }));
          }}
        />
      )}

      {/* Appoint an Accountant */}
      {modals.appoint_accountant !== null && (
        <AppointAccountant
          userId={modals.appoint_accountant}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              appoint_accountant: null,
            }));
          }}
        />
      )}

      {/* Appoint a Commercial Manager */}
      {modals.appoint_commercial_manager !== null && (
        <AppointCommercialManager
          userId={modals?.appoint_commercial_manager}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              appoint_commercial_manager: null,
            }));
          }}
        />
      )}

      {/* User Balance Transaction */}
      {modals.balance_sheet_transaction && (
        <BalanceTransaction
          id={modals.balance_sheet_transaction}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              balance_sheet_transaction: null,
            }));
          }}
        />
      )}

      <UserModals
        modals={modals}
        setModals={setModals}
        setPageHelper={setPageHelper}
      />
    </>
  );
};

export default Users;
