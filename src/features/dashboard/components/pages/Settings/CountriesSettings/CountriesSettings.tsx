import styles from "@/features/dashboard/components/pages/Dashboard.module.scss";
import Filter from "@/components/Filter/Filter.tsx";
import FilterPopup from "@/features/dashboard/components/shared/Filter/FilterPopup.tsx";
import Table from "@/components/Table/Table.tsx";
import { getLocationTableHeaders } from "@/features/dashboard/constants/tableHeader.constant.tsx";
import { AuthContext } from "@/contexts/AuthContext.tsx";
import { useContext, useEffect, useState } from "react";
import { PageHelperStateType } from "@/features/dashboard/models/shared.model.ts";
import { useFilterInputsChanger } from "@/hooks/useFilterInputsChanger.ts";
import { countriesFilterConstants } from "@/features/dashboard/constants/filters.constant.tsx";
import { getAllCountriesRequest } from "@/features/dashboard/services/location.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import { usePageChanger } from "@/hooks/usePageChanger.ts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CountriesSettings = ({
  changeSettings,
}: {
  changeSettings: () => void;
}) => {
  const { page } = usePageChanger();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { setLoader } = useContext(LoaderContext);

  const [pageHelper, setPageHelper] = useState<PageHelperStateType>({
    response: null,
    render: false,
    tabs: [],
    activeTab: 0,
    buttons: [
      {
        title: "Country create",
        onClick: () => {
          console.log("salam");
        },
      },
      {
        title: "back",
        onClick: () => {
          navigate(`/${i18n.language}/settings`);
          changeSettings();
        },
      },
    ],
  });

  // Filter Inputs
  const { filterInputsData, setFilterInputsData, resetFilterInputs } =
    useFilterInputsChanger({ ...countriesFilterConstants });

  const getAllCountries = async () => {
    setLoader(true);
    const { status, data } = await getAllCountriesRequest(
      page,
      10,
      filterInputsData.country.value,
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
    getAllCountries().catch(() => {});
  }, [page, pageHelper.render]);
  return (
    <>
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
          tableRow={getLocationTableHeaders(
            pageHelper.activeTab,
            i18n.language,
            auth.role,
          )}
        >
          {pageHelper.response?.countries?.map((country, index) => (
            <tr key={index}>
              <td>{country.id}</td>
              <td>{country.name}</td>
            </tr>
          ))}
        </Table>
      </div>
    </>
  );
};

export default CountriesSettings;
