import styles from "./PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import { useTranslation } from "react-i18next";
import SelectList from "@/features/dashboard/components/shared/SelectList/SelectList.tsx";
import Input from "@/components/Input/Input.tsx";
import { useCallback, useContext, useRef, useState } from "react";
import axios from "axios";
import PackagingForm, {
  PackagingData,
  RouteData,
} from "@/features/dashboard/components/shared/PackagingForm/PackagingForm.tsx";
import Button from "@/components/Button/Button.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { useNavigate } from "react-router-dom";
import i18n from "@/locales/i18n.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

const PriceQuotation = () => {
  const { setLoader } = useContext(LoaderContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userData = localStorage.getItem("priceRegisterUser");
  let user = {};
  if (userData) {
    user = JSON.parse(userData);
  }

  const selectListRef = useRef<HTMLDivElement>(null);
  const packagingFormRef = useRef<HTMLDivElement>(null);
  const dateSectionRef = useRef<HTMLDivElement>(null);

  const [selectedCargo, setSelectedCargo] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [selectedCode, setSelectedCode] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [totalWeight, setTotalWeight] = useState<string>("");

  const [unCode, setUnCode] = useState("");
  const [msDs, setMsDs] = useState<File | null>(null);
  const [msDsPictures, setMsDsPictures] = useState<File[]>([]);
  const [dangerous, setDangerous] = useState(false);

  const [packagingData, setPackagingData] = useState<PackagingData>({
    package_type: "Container",
    total_quantity: 0,
    net_weight: 0,
    gross_weight: 0,
  });

  const [stackable, setStackable] = useState(false);
  const [inRow, setInRow] = useState(0);
  const [requestContainerProvision, setRequestContainerProvision] =
    useState(false);
  const [requestWagonProvision, setRequestWagonProvision] = useState(false);
  const [transportationType, setTransportationType] = useState<string>("Rail");
  const [wagonType, setWagonType] = useState<string>("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");

  const [routes, setRoutes] = useState<RouteData[]>([]);

  const handleWagonTypeChange = (type: string) => setWagonType(type);
  const handlePackagingDataChange = (data: PackagingData) =>
    setPackagingData(data);
  const handleRoutesChange = useCallback(
    (newRoutes: RouteData[]) => setRoutes(newRoutes),
    [],
  );
  const handleTransportationTypeChange = (type: string) =>
    setTransportationType(type);

  const scrollToElement = (
    ref: React.RefObject<HTMLElement>,
    message: string,
  ) => {
    toast.error(message);

    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        ref.current.classList.add(styles.highlightError);

        setTimeout(() => {
          if (ref.current) {
            ref.current.classList.remove(styles.highlightError);
          }
        }, 3000);

        const inputElement = ref.current.querySelector(
          "input, select, textarea",
        );
        if (inputElement) {
          setTimeout(() => {
            (inputElement as HTMLElement).focus();
          }, 500);
        }
      }
    }, 100);
  };

  const handleSubmit = async (status: "draft" | "send") => {
    if (!selectedCode) {
      scrollToElement(selectListRef, "Please select HsCode and CargoName");
      return;
    }

    if (!packagingData.package_type || packagingData.package_type === "") {
      scrollToElement(packagingFormRef, "Please select Packaging type");
      return;
    }

    const requestedRoute = routes[1];
    if (requestedRoute) {
      const hasFromData =
        requestedRoute.start_country_id ||
        requestedRoute.start_address ||
        requestedRoute.start_station_id ||
        requestedRoute.start_port_id;

      const hasToData =
        requestedRoute.end_country_id ||
        requestedRoute.end_address ||
        requestedRoute.end_station_id ||
        requestedRoute.end_port_id;

      if (!hasFromData || !hasToData) {
        scrollToElement(
          packagingFormRef,
          "Please fill Requested route fields (From and To)",
        );
        return;
      }
    }

    if (!startDate || endDate === "") {
      scrollToElement(dateSectionRef, "Please select Date");
      return;
    }

    setLoader(true);

    const filteredRoutes = routes.filter(
      (route) =>
        route.start_country_id !== null ||
        route.end_country_id !== null ||
        route.start_address !== "" ||
        route.end_address !== "",
    );

    const formattedRoutes = filteredRoutes.map((route, index) => ({
      start_country_id: route.start_country_id,
      start_city_id: route.start_city_id,
      start_address: route.start_address,
      start_station_id: route.start_station_id,
      start_port_id: route.start_port_id,
      end_country_id: route.end_country_id,
      end_city_id: route.end_city_id,
      end_address: route.end_address,
      end_station_id: route.end_station_id,
      end_port_id: route.end_port_id,
      is_main: index === 0,
      route_type: ["full", "requested", "container", "wagon"][index] || "full",
    }));

    const order = {
      hs_code_id: selectedCode.value,
      total_weight: parseFloat(totalWeight),
      un_code: unCode,
      dangerous,
      packing: packagingData,
      stackable,
      request_container_provision: requestContainerProvision,
      request_wagon_provision: requestWagonProvision,
      in_row: inRow,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      transport_type: transportationType.toLowerCase(),
      wagon_type: wagonType.toLowerCase(),
      note,
      routes: formattedRoutes,
    };

    const formData = new FormData();
    formData.append("user", JSON.stringify(user));
    formData.append("order", JSON.stringify(order));
    formData.append("btn_status", status);

    if (msDs) formData.append("msds", msDs);
    msDsPictures.forEach((file) => formData.append(`cargo_image`, file));

    try {
      const response = await axios.post(
        `${apiUrl}/commercial/price-quotation/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (response && response.status === 200) {
        navigate(`/${i18n.language}/auth/login`);
        toast.success(errorMessageHandler(response.data));
        setLoader(false);
      } else {
        toast.error(errorMessageHandler(response.data));
        setLoader(false);
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        errorMessageHandler(error.response?.data || "An error occurred"),
      );
      setLoader(false);
    }
  };

  return (
    <div className={styles.price__quotation}>
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <h1 className={styles.title}>{t("price.title")}</h1>
          <div className={styles.input__list} ref={selectListRef}>
            <SelectList
              selectedCargo={selectedCargo}
              setSelectedCargo={setSelectedCargo}
              selectedCode={selectedCode}
              setSelectedCode={setSelectedCode}
            />
            <div className={styles.input}>
              <Input
                label="Total Weight"
                placeholder="Weight"
                value={totalWeight}
                onChange={(e) => setTotalWeight(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.expendable}>
          <GetExpandableSection
            unCode={unCode}
            setUnCode={setUnCode}
            msDs={msDs}
            setMsDs={setMsDs}
            msDsPictures={msDsPictures}
            setMsDsPictures={setMsDsPictures}
            dangerous={dangerous}
            setDangerous={setDangerous}
          />
        </div>

        <div ref={packagingFormRef}>
          <PackagingForm
            onDataChange={handlePackagingDataChange}
            onRoutesChange={handleRoutesChange}
            onStackableChange={setStackable}
            onInRowChange={setInRow}
            onContainerProvisionChange={setRequestContainerProvision}
            onWagonProvisionChange={setRequestWagonProvision}
            onTransportationTypeChange={handleTransportationTypeChange}
            onWagonTypeChange={handleWagonTypeChange}
          />
        </div>

        <div>
          <h1 className={styles.period}>Transport Period</h1>
          <div className={styles.date} ref={dateSectionRef}>
            <Input
              type="date"
              label="Start Date"
              red="*"
              style={{ height: "52px" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              red="*"
              style={{ height: "52px" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.note}>
          <label className={styles.label}>Note</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Your note here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className={styles.button}>
          <Button
            onClick={() => handleSubmit("send")}
            text="Send"
            viewType="dark-green"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceQuotation;
