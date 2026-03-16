import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import Input from "@/components/Input/Input.tsx";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import GetPackagingForm, {
  PackagingData,
  RouteData,
} from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import Button from "@/components/Button/Button.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";

import GetShipper, {
  DynamicFormRef,
} from "@/features/dashboard/components/shared/Shipper/GetShipper/GetShipper.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "@/libs/cookie.ts";
import i18n from "i18next";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";
import GetSelectList from "@/features/dashboard/components/shared/GetSelectList/GetSelectList.tsx";
import { QuotationData } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

const AskQuotation = () => {
  const { setLoader } = useContext(LoaderContext);
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const showShipper = location.state?.showShipper ?? true;

  const selectListRef = useRef<HTMLDivElement>(null);
  const packagingFormRef = useRef<HTMLDivElement>(null);
  const dateSectionRef = useRef<HTMLDivElement>(null);
  const shipperSectionRef = useRef<HTMLDivElement>(null);

  const shipperRef = useRef<DynamicFormRef>(null);

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

  const handleWagonTypeChange = useCallback(
    (type: string) => setWagonType(type),
    [],
  );
  const handlePackagingDataChange = useCallback(
    (data: PackagingData) => setPackagingData(data),
    [],
  );
  const handleRoutesChange = useCallback(
    (newRoutes: RouteData[]) => setRoutes(newRoutes),
    [],
  );
  const handleTransportationTypeChange = useCallback(
    (type: string) => setTransportationType(type),
    [],
  );

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

    if (showShipper) {
      const shipperData = shipperRef.current?.getFormData();

      if (!shipperData?.shipper || shipperData.shipper.trim() === "") {
        scrollToElement(shipperSectionRef, "Please fill Shipper field");
        return;
      }

      if (!shipperData?.consignee || shipperData.consignee.trim() === "") {
        scrollToElement(shipperSectionRef, "Please fill Consignee field");
        return;
      }
    }

    if (!startDate || endDate === "") {
      scrollToElement(dateSectionRef, "Please select Date");
      return;
    }

    setLoader(true);

    const shipperData = shipperRef.current?.getFormData();

    const containerNumbers = shipperData?.containerNumbers || "";
    const containerDropOffs = shipperData?.containerDropOffs || "";
    const wagonNumbers = shipperData?.wagonNumbers || "";
    const wagonDropOffs = shipperData?.wagonDropOffs || "";

    const transformedShipperData = shipperData
      ? {
          shipper: shipperData.shipper,
          consignee: shipperData.consignee,
          notify_party: shipperData.notifyPartyValue,
          terminal: shipperData.terminalValue,
          container_owner: shipperData.containerOwnerValue,
          wagon_owner: shipperData.wagonOwnerValue,
          container_no: containerNumbers,
          container_drop_off: containerDropOffs,
          wagon_no: wagonNumbers,
          wagon_drop_off: wagonDropOffs,
        }
      : {};

    const routesWithTypes = routes.map((route, index) => ({
      ...route,
      route_type: ["full", "requested", "container", "wagon"][index] || "full",
    }));

    const filteredRoutes = routesWithTypes.filter(
      (route) =>
        route.start_country_id !== null ||
        route.end_country_id !== null ||
        route.start_address !== "" ||
        route.end_address !== "" ||
        route.start_station_id !== null ||
        route.end_station_id !== null ||
        route.start_port_id !== null ||
        route.end_port_id !== null,
    );

    const formattedRoutes = filteredRoutes.map((route) => ({
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
      is_main: false,
      route_type: route.route_type,
    }));

    const quotation = {
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
      shipment_serializer: transformedShipperData,
    };

    const formData = new FormData();
    formData.append("order", JSON.stringify(quotation));
    formData.append("btn_status", status);

    if (msDs) formData.append("msds", msDs);

    if (msDsPictures && Array.isArray(msDsPictures)) {
      msDsPictures.forEach((file) => formData.append(`cargo_image`, file));
    }

    try {
      const response = await axios.put(
        `${apiUrl}/commercial/update-order-quotation/?order_id=${order.order_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getCookie("allianceToken"),
          },
        },
      );
      if (response && response.status === 200) {
        navigate(`/${i18n.language}/users`);
        toast.success(errorMessageHandler(response.data));
      } else {
        toast.error(errorMessageHandler(response.data));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while submitting the form");
    }
    setLoader(false);
  };

  const [notes, setNotes] = useState<
    Array<{
      name: string;
      role: string;
      date: string;
      note: string;
    }>
  >([]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;

          if (apiData) {
            setTotalWeight(apiData.total_weight?.toString() || "");
            setStartDate(apiData.start_date);
            setEndDate(apiData.end_date);
          }

          if (apiData.note) {
            try {
              if (typeof apiData.note === "string") {
                const parsed = JSON.parse(apiData.note);
                setNotes(Array.isArray(parsed) ? parsed : [parsed]);
              } else if (Array.isArray(apiData.note)) {
                setNotes(apiData.note);
              } else if (typeof apiData.note === "object") {
                setNotes([apiData.note]);
              }
            } catch (e) {
              console.error("Error parsing notes:", e);
              setNotes([
                {
                  name: "System",
                  role: "system",
                  date: new Date().toISOString(),
                  note:
                    typeof apiData.note === "string"
                      ? apiData.note
                      : "Invalid note format",
                },
              ]);
            }
          } else {
            setNotes([]);
          }
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };

    fetchRequest();
  }, [order]);

  return (
    <div className={styles.price__quotation}>
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <div className={styles.input__list} ref={selectListRef}>
            <GetSelectList
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
          <GetPackagingForm
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

        {showShipper && (
          <div style={{ marginBottom: "32px" }} ref={shipperSectionRef}>
            <GetShipper ref={shipperRef} />
          </div>
        )}

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
          {notes.length > 0 && (
            <div className={styles.notesList}>
              <h3>Previous Notes:</h3>
              {notes.map((item, index) => (
                <div key={index} className={styles.noteItem}>
                  <div className={styles.noteHeader}>
                    <strong>{item.name}</strong>
                    <span className={styles.role}>({item.role})</span>
                    <span className={styles.date}>
                      {new Date(item.date).toLocaleString()}
                    </span>
                  </div>
                  <p className={styles.noteContent}>{item.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.button}>
          <Button
            onClick={() => handleSubmit("draft")}
            text="Save as draft"
            viewType="green__light"
          />
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

export default AskQuotation;
