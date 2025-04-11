import { useContext, useEffect, useState } from "react";
import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import Filter from "@/components/Filter/Filter.tsx";

import { useNavigate } from "react-router-dom";

import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";
import Table from "@/components/Table/Table.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";

import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { useTranslation } from "react-i18next";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";
import ServiceCreated from "@/features/dashboard/components/shared/Modals/Services/ServiceCreated.tsx";
import ServicesTableRow from "@/features/dashboard/components/pages/Services/ServicesTableRow.tsx";
import { ServiceModel } from "@/features/dashboard/models/service.model.ts";
import { getServicesTableHeaders } from "@/features/dashboard/constants/tableHeader.constant.tsx";
import {
  ContractStatus,
  Roles,
} from "@/features/dashboard/constants/enum.constant.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { getAllServicesRequest } from "@/features/dashboard/services/services.service.ts";
import { servicesFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import ServiceContractApproval from "@/features/dashboard/components/shared/Modals/Services/ServiceContractApproval.tsx";
import DeleteServiceContract from "@/features/dashboard/components/shared/Modals/Services/DeleteServiceContract.tsx";
import PageTitle from "@/features/dashboard/components/shared/PageTitle/PageTitle.tsx";
import AddSellingPrice from "@/features/dashboard/components/shared/Modals/Services/AddSellingPrice.tsx";
import MonitoringPending from "@/features/dashboard/components/shared/Modals/Services/MonitoringPending.tsx";

const Services = () => {
  // React
  const navigate = useNavigate();
  const { setLoader } = useContext(LoaderContext);
  const { i18n, t } = useTranslation();

  // Contexts
  const { auth } = useContext(AuthContext);

  // Hooks
  const { page } = usePageChanger();
  const { filterInputsData, setFilterInputsData, resetFilterInputs } =
    useFilterInputsChanger({ ...servicesFilterConstants });

  // States
  const [pageHelper, setPageHelper] = useState<PageHelperStateType>({
    response: null,
    render: false,
    tabs: [
      // Admin, Commercial Directory, Lawyer, Buyers
      ...([
        Roles.commercial_directory,
        Roles.lawyer,
        Roles.buyer_manager,
      ].includes(auth?.role as Roles)
        ? [
            {
              name: "services.tabs.one",
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
              name: "services.tabs.two",
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
              name: "services.tabs.three",
              tab: 2,
              onClick: () => {
                setPageHelper((prevState) => ({
                  ...prevState,
                  activeTab: 2,
                }));
                navigate(`${location.pathname}?page=${1}`);
              },
            },
          ]
        : []),

      // Monitoring
      ...([Roles.monitoring].includes(auth?.role as Roles)
        ? [
            {
              name: "services.tabs.two",
              tab: 0,
              onClick: () => {},
            },
          ]
        : []),
    ],
    activeTab: 0,
    buttons: [
      {
        title: t("services.buttons.create"),
        onClick: () => {
          setModals((prevState) => ({
            ...prevState,
            service_create: true,
          }));
        },
      },
    ],
  });

  const [modals, setModals] = useState<{
    service_create: boolean;
    service_contract_verified: ServiceModel | null;
    service_contract_deleted: ServiceModel | null;
    service_selling_price: ServiceModel | null;
    service_monitoring_pending: ServiceModel | null;
  }>({
    service_create: false,
    service_contract_verified: null,
    service_contract_deleted: null,
    service_selling_price: null,
    service_monitoring_pending: null,
  });

  // Functions
  const getAllServices = async () => {
    setLoader(true);

    let contractStatus;

    if (Roles.monitoring === auth.role) {
      contractStatus = "monitoring";
    } else {
      contractStatus = [
        "admin",
        "lawyer",
        "buyer_manager",
        "commercial_directory",
      ].includes(auth.role)
        ? ContractStatus[pageHelper.activeTab]
        : "verified";
    }

    const { status, data } = await getAllServicesRequest(
      page,
      10,
      filterInputsData.name.value,
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

  // useEffects
  useEffect(() => {
    getAllServices().catch(() => {});
  }, [pageHelper.activeTab, page, pageHelper.render]);

  return (
    <>
      <div className={styles.dashboard}>
        <PageTitle title={t("services.title")} />

        <Filter
          buttons={
            ["admin", "buyer_manager"].includes(auth.role)
              ? pageHelper.buttons
              : []
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
            resetFilterInputs();
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
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
            tableRow={getServicesTableHeaders(
              pageHelper.activeTab,
              i18n.language,
              auth.role,
            )}
          >
            {pageHelper.response?.service?.map(
              (service: ServiceModel, index: number) => (
                <ServicesTableRow
                  key={`row_data_${index}`}
                  activeTab={pageHelper.activeTab}
                  service={service}
                  setModals={setModals}
                />
              ),
            )}
          </Table>
        </div>
      </div>

      {/* Modals */}
      {modals.service_create && (
        <ServiceCreated
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              service_create: false,
            }));
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
          }}
        />
      )}

      {modals.service_contract_verified && (
        <ServiceContractApproval
          service={modals.service_contract_verified}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              service_contract_verified: null,
            }));
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
          }}
        />
      )}

      {modals.service_contract_deleted && (
        <DeleteServiceContract
          service={modals.service_contract_deleted}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              service_contract_deleted: null,
            }));
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
          }}
        />
      )}

      {modals.service_selling_price && (
        <AddSellingPrice
          service={modals.service_selling_price}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              service_selling_price: null,
            }));
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
          }}
        />
      )}

      {modals.service_monitoring_pending && (
        <MonitoringPending
          service={modals.service_monitoring_pending}
          modalClose={() => {
            setModals((prevState) => ({
              ...prevState,
              service_monitoring_pending: null,
            }));
            setPageHelper((prevState) => ({
              ...prevState,
              render: !prevState.render,
            }));
          }}
        />
      )}
    </>
  );
};

export default Services;
