// Reacts
import React from "react";

// Types
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";
import { UserModalsProps } from "@/features/dashboard/components/pages/Users/Users.tsx";

// Components
import UserCreate from "@/features/dashboard/components/shared/Modals/Users/User/UserCreate.tsx";
import UserUpdate from "@/features/dashboard/components/shared/Modals/Users/User/UserUpdate.tsx";
import UserDelete from "@/features/dashboard/components/shared/Modals/Users/User/UserDelete.tsx";

import AddContract from "@/features/dashboard/components/shared/Modals/Users/Contract/AddContract.tsx";
import ContractVerification from "@/features/dashboard/components/shared/Modals/Users/Contract/ContractVerification.tsx";
import ContractDelete from "@/features/dashboard/components/shared/Modals/Users/Contract/ContractDelete.tsx";

import BalanceTransaction from "@/features/dashboard/components/shared/Modals/Users/Balance/BalanceTransaction.tsx";

import AppointAccountant from "@/features/dashboard/components/shared/Modals/Users/Appointment/AppointAccountant.tsx";
import AppointCommercialManager from "@/features/dashboard/components/shared/Modals/Users/Appointment/AppointCommercialManager.tsx";

const UserModals = ({
  modals,
  setModals,
  setPageHelper,
}: {
  modals: UserModalsProps;
  setModals: React.Dispatch<React.SetStateAction<UserModalsProps>>;
  setPageHelper: React.Dispatch<React.SetStateAction<PageHelperStateType>>;
}) => {
  return (
    <>
      {/* Create Modal */}
      {modals.create && (
        <UserCreate
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
      {/**/}

      {/* Update Modal */}
      {modals.update && (
        <UserUpdate
          user={modals.update}
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

      {/* Delete Modal */}
      {modals.delete && (
        <UserDelete
          user={modals.delete}
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
    </>
  );
};

export default UserModals;
