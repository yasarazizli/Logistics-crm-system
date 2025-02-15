// Yenilenenler
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";

import Filter from "@/components/Filter/Filter.tsx";
import Table from "@/components/Table/Table.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

import { AuthContext } from "@/contexts/AuthContext.tsx";
import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";
import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";
import { getVendorsTableHeaders } from "@/features/dashboard/constants/tableHeader.constant.tsx";
import { useTranslation } from "react-i18next";
import CreatVendor from "@/features/dashboard/components/shared/Modals/Vendors/CreatVendor.tsx";
import { toast } from "react-toastify";
import { getAllVendorsRequest } from "@/features/dashboard/services/vendors.service.ts";
import { ContractStatus } from "@/features/dashboard/constants/enum.constant.tsx";
import VendorsTableRow from "@/features/dashboard/components/pages/Vendors/VendorsTableRow.tsx";
import VendorContractApproval from "@/features/dashboard/components/shared/Modals/Vendors/VendorContractApproval.tsx";
import DeleteVendorContract from "@/features/dashboard/components/shared/Modals/Vendors/DeleteVendorContract.tsx";
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";
import { VendorModel } from "@/features/dashboard/models/vendor.model.ts";
import { userFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import ActiveVendorContract from "@/features/dashboard/components/shared/Modals/Vendors/ActiveVendorContract.tsx";

const Vendors = () => {
  // React
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  // Contexts
  const { auth } = useContext(AuthContext);
  const { setLoader } = useContext(LoaderContext);

  // States
  const [pageHelper, setPageHelper] = useState<PageHelperStateType>({
    response: null,
    render: false,
    tabs: [
      {
        name: "vendors.tabs.one",
        tab: 0,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 0,
          }));
          navigate(`${location.pathname}?page=${1}`);
        },
      },
      {
        name: "vendors.tabs.two",
        tab: 1,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 1,
          }));
          navigate(`${location.pathname}?page=${1}`);
        },
      },
      {
        name: "vendors.tabs.three",
        tab: 2,
        onClick: () => {
          setPageHelper((prevState) => ({
            ...prevState,
            activeTab: 2,
          }));
          navigate(`${location.pathname}?page=${1}`);
        },
      },
    ],
    activeTab: 0,
    buttons: [
      {
        title: "vendors.buttons.create",
        onClick: () =>
          setModals((prevState) => ({
            ...prevState,
            vendor_create: true,
          })),
      },
    ],
  });

  const [modals, setModals] = useState<{
    vendor_create: boolean;
    vendor_contract_verified: VendorModel | null;
    vendor_contract_deleted: VendorModel | null;
    vendor_contract_active: VendorModel | null;
  }>({
    vendor_create: false,
    vendor_contract_verified: null,
    vendor_contract_deleted: null,
    vendor_contract_active: null,
  });

  // Hooks
  const { page } = usePageChanger();
  const { filterInputsData, setFilterInputsData, resetFilterInputs } =
    useFilterInputsChanger({ ...userFilterConstants });

  const getAllVendors = async () => {
    setLoader(true);

    const contractStatus = ["admin", "lawyer", "buyer_manager"].includes(
      auth.role,
    )
      ? ContractStatus[pageHelper.activeTab]
      : "verified";

    const { status, data } = await getAllVendorsRequest(
      page,
      10,
      "",
      contractStatus,
      "",
      "",
    );

    if (status === 200) {
      setPageHelper((prevState) => ({
        ...prevState,
        response: data,
      }));
    }

    setLoader(false);
  };

  // useEffects
  useEffect(() => {
    getAllVendors().catch((err) => toast.error(err.message));
  }, [pageHelper.activeTab, page, pageHelper.render]);

  return (
    <>
      {/* Page Content START */}
      <div className={styles.dashboard}>
        <PageTitle title={t("vendors.title")} />

        <Filter
          buttons={
            (["admin", "buyer_manager"].includes(auth.role) &&
              pageHelper.buttons) ||
            []
          }
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
              reRender: !prevState.render,
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
            tableRow={getVendorsTableHeaders(
              pageHelper.activeTab,
              i18n.language,
              auth.role,
            )}
          >
            {pageHelper.response?.vendors?.map(
              (vendor: VendorModel, index: number) => (
                <VendorsTableRow
                  key={`table_row_${index}${vendor.id}`}
                  vendor={vendor}
                  activeTab={pageHelper.activeTab}
                  setModals={setModals}
                />
              ),
            )}
          </Table>
        </div>
      </div>
      {/* Page Content END */}

      {/* ------------ Modals ------------ */}
      {/* Role:buyer_manager | Modal to create a vendor */}
      {modals.vendor_create && (
        <CreatVendor
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              vendor_create: false,
            }));
          }}
        />
      )}

      {modals.vendor_contract_active && (
        <ActiveVendorContract
          vendor={modals.vendor_contract_active}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              vendor_contract_active: null,
            }));
          }}
        />
      )}

      {/* Role:lawyer | Modal to confirm vendor agreement */}
      {modals.vendor_contract_verified && (
        <VendorContractApproval
          vendor={modals.vendor_contract_verified}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              vendor_contract_verified: null,
            }));
          }}
        />
      )}

      {/* Role:lawyer | Modal for deleting a vendor contract */}
      {modals.vendor_contract_deleted && (
        <DeleteVendorContract
          vendor={modals.vendor_contract_deleted}
          modalClose={(isRender) => {
            setPageHelper((prevState) => ({
              ...prevState,
              render: isRender ? !prevState.render : prevState.render,
            }));
            setModals((prevState) => ({
              ...prevState,
              vendor_contract_deleted: null,
            }));
          }}
        />
      )}
    </>
  );
};

export default Vendors;
