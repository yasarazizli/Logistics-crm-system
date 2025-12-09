import styles from "@/features/auth/components/pages/PriceQuotation/PriceQuotation.module.scss";
import Header from "@/components/Header/Header.tsx";
import { useTranslation } from "react-i18next";
import Input from "@/components/Input/Input.tsx";
import { useEffect, useRef, useState, useCallback, useContext } from "react";
import axios from "axios";
import Button from "@/components/Button/Button.tsx";
import { toast } from "react-toastify";
import InputSection from "@/features/dashboard/components/shared/InputSection/InputSection.tsx";
import GetExpandableSection from "@/features/dashboard/components/shared/GetExpandableSection/GetExpandableSection.tsx";
import GetSelectList from "@/features/dashboard/components/shared/GetSelectList/GetSelectList.tsx";
import {
  GetOffer,
  QuotationData,
  UserData,
} from "@/features/dashboard/services/CommercialManager/commercial.service.ts";
import GetPackagingForm from "@/features/dashboard/components/shared/GetPackagingForm/GetPackagingForm.tsx";
import { getCookie } from "@/libs/cookie.ts";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "@/features/dashboard/components/shared/Table/Table.tsx";
import Shipper, {
  DynamicFormRef,
} from "@/features/dashboard/components/shared/Shipper/Shipper.tsx";
import { errorMessageHandler } from "@/libs/error.ts";
import i18n from "i18next";
import Note from "@/features/dashboard/components/shared/Modals/Note/Note.tsx";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";

const apiUrl = import.meta.env.VITE_API_URL;

interface QuotationType {
  total_weight: number;
  packing: {
    start_date: string;
    end_date: string;
  };
}

interface ServiceItem {
  id: number;
  name_of_service: string;
  service_id: number;
  location: string;
  transport_mode: string;
  from: string;
  to: string;
  transport_type: string;
  payload: number;
  total_quantity: number;
  estimated_transport_time: number;
  purchase_price_per_ton: number;
  purchase_price_per_unit: number;
  unit: string;
  total_purchase_price: number;
  selling_price: number;
  total_selling_price: number;
  vat_amount: number;
  vat_18: boolean;
  profit: number;
  vendor: string;
  note: string;
  packing: {
    id: number;
    package_type: string;
    packing_type: string;
    size: number;
    total_quantity: number;
    net_weight: number;
    gross_weight: number;
    width: number;
    height: number;
    length: number;
  };
}

interface Offer {
  id: number;
  service: ServiceItem[];
  amount: string;
  vat: string;
  total_amount: string;
  per_ton_price: string;
  transportation_time: string;
  isShipperOpen: boolean;
  shipperData: any;
  isDataLoaded?: boolean;
  note?: string;
}

const CustomerInformation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoader } = useContext(LoaderContext);
  const order = location.state?.order;
  const { t } = useTranslation();

  const [selectedCargo, setSelectedCargo] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [selectedCode, setSelectedCode] = useState<{
    label: string;
    value: number;
  } | null>(null);
  const [totalWeight, setTotalWeight] = useState<string>("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generalNote, setGeneralNote] = useState("");

  const [offers, setOffers] = useState<Offer[]>([]);
  const shipperRefs = useRef<{ [key: number]: DynamicFormRef }>({});
  const dataLoadedRef = useRef<{ [key: number]: boolean }>({});
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  const [modal, setModal] = useState<{
    type: "create";
    offerId: number;
  } | null>(null);
  const [offerNotes, setOfferNotes] = useState<{ [key: number]: string }>({});

  const handleExtraChange = (name: string, value: string) =>
    setExtraInputs((prev) => ({ ...prev, [name]: value }));

  const pageRef = useRef<HTMLDivElement | null>(null);

  const sendSelectedOffer = async () => {
    setLoader(true);
    if (!selectedOfferId) {
      toast.error("Please select an offer first! (Click the Edit button)");
      setLoader(false);
      return;
    }

    const shipperRef = shipperRefs.current[selectedOfferId];

    const shipperData = shipperRef.getFormData();

    const formData = new FormData();

    const shipment = {
      shipper: shipperData.shipper,
      consignee: shipperData.consignee,
      notify_party: shipperData.notifyPartyValue,
      terminal: shipperData.terminalValue,
      container_owner: shipperData.containerOwnerValue,
      wagon_owner: shipperData.wagonOwnerValue,
      container_no: shipperData.containerNumbers,
      container_drop_off: shipperData.containerDropOffs,
      wagon_no: shipperData.wagonNumbers,
      wagon_drop_off: shipperData.wagonDropOffs,
    };

    const allOfferNotes = offers.map((offer) => ({
      note: offerNotes[offer.id] || "",
      id: offer.id,
    }));

    formData.append("shipment", JSON.stringify(shipment));
    formData.append("btn_status", "send");
    formData.append("offer_note", JSON.stringify(allOfferNotes));

    try {
      const response = await axios.post(
        `${apiUrl}/commercial/approve-offer/?order_id=${order.order_id}&offer_id=${selectedOfferId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getCookie("allianceToken"),
          },
        },
      );

      if (response?.status === 200) {
        toast.success(errorMessageHandler(response.data));
        navigate(`/${i18n.language}/users`);
        fetchOffers();
        const clearedNotes: { [key: number]: string } = {};
        offers.forEach((offer) => {
          clearedNotes[offer.id] = "";
        });
        setOfferNotes(clearedNotes);
      }
    } catch (error) {
      console.error("Gönderme hatası:", error);
      toast.error("Error sending offer");
    }
    setLoader(false);
  };

  const rejectOffer = async () => {
    if (!selectedOfferId) {
      toast.error("Please select an offer first! (Click the Edit button)");
      return;
    }

    const note = offerNotes[selectedOfferId] || "";
    if (!note.trim()) {
      toast.error("Please enter the reason for rejection!");
      return;
    }

    const formData = new FormData();

    const allOfferNotes = offers.map((offer) => ({
      note: offerNotes[offer.id] || "",
      id: offer.id,
    }));

    formData.append("btn_status", "reject");
    formData.append("offer_note", JSON.stringify(allOfferNotes));

    try {
      const response = await axios.post(
        `${apiUrl}/commercial/approve-offer/?order_id=${order.order_id}&offer_id=${selectedOfferId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getCookie("allianceToken"),
          },
        },
      );

      if (response?.status === 200) {
        toast.success(errorMessageHandler(response.data));
        navigate(`/${i18n.language}/users`);
        fetchOffers();
        const clearedNotes: { [key: number]: string } = {};
        offers.forEach((offer) => {
          clearedNotes[offer.id] = "";
        });
        setOfferNotes(clearedNotes);
      }
    } catch (error) {
      console.error("Reddetme hatası:", error);
      toast.error("Teklif reddedilirken hata oluştu");
    }
  };

  const EditOffer = async () => {
    const formData = new FormData();

    const allOfferNotes = offers.map((offer) => ({
      note: offerNotes[offer.id] || "",
      id: offer.id,
    }));

    formData.append("btn_status", "edit");
    formData.append("offer_note", JSON.stringify(allOfferNotes));

    try {
      const response = await axios.post(
        `${apiUrl}/commercial/approve-offer/?order_id=${order.order_id}&offer_id=${selectedOfferId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getCookie("allianceToken"),
          },
        },
      );

      if (response?.status === 200) {
        toast.success(errorMessageHandler(response.data));
        navigate(`/${i18n.language}/users`);
        fetchOffers();
        const clearedNotes: { [key: number]: string } = {};
        offers.forEach((offer) => {
          clearedNotes[offer.id] = "";
        });
        setOfferNotes(clearedNotes);
      }
    } catch (error) {
      console.error("Reddetme hatası:", error);
      toast.error("Teklif reddedilirken hata oluştu");
    }
  };

  const handleEditClick = (offerId: number) => {
    setSelectedOfferId(offerId);
    setModal({ type: "create", offerId });
  };

  const handleNoteSave = (offerId: number, noteText: string) => {
    setOfferNotes((prev) => ({ ...prev, [offerId]: noteText }));
  };

  const [, setQuotation] = useState<QuotationType | null>(null);

  const fetchOffers = async () => {
    try {
      const response = await GetOffer(order.order_id);
      console.log("Full API response:", response);

      if (response?.status === 200) {
        const apiData = response?.data;
        console.log("API data:", apiData);

        if (Array.isArray(apiData) && apiData.length > 0) {
          const formattedOffers: Offer[] = apiData.map(
            (offer: any, index: number) => ({
              id: offer.id || index + 1,
              service: offer.service || [],
              amount: offer.amount || "0",
              vat: offer.vat || "0",
              total_amount: offer.total_amount || "0",
              per_ton_price: offer.per_ton_price || "0 $",
              transportation_time: offer.transportation_time || "0 days",
              isShipperOpen: false,
              shipperData: {
                shipper: offer.shipper || "",
                consignee: offer.consignee || "",
                notify_party: offer.notify_party || "",
                terminal: offer.terminal || "",
                container_owner: offer.container_owner || "",
                wagon_owner: offer.wagon_owner || "",
                container_no: offer.container_no || "",
                container_drop_off: offer.container_drop_off || "",
                wagon_no: offer.wagon_no || "",
                wagon_drop_off: offer.wagon_drop_off || "",
              },
              isDataLoaded: false,
              note: offer.note || "",
            }),
          );
          setOffers(formattedOffers);

          const initialNotes: { [key: number]: string } = {};
          formattedOffers.forEach((offer) => {
            initialNotes[offer.id] = offer.note || "";
          });
          setOfferNotes(initialNotes);

          dataLoadedRef.current = {};
        } else {
          setOffers([]);
        }
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Təkliflər yüklənərkən xəta baş verdi");
      setOffers([]);
    }
  };

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await QuotationData(order.order_id);
        if (response?.status === 200) {
          const apiData = response?.data;
          setQuotation(apiData || null);

          if (apiData) {
            setTotalWeight(apiData.total_weight?.toString() || "");
            setStartDate(apiData.start_date || "");
            setEndDate(apiData.end_date || "");
          }
        }
      } catch (error) {
        console.error("Error fetching quotation:", error);
      }
    };

    fetchRequest();
  }, [order]);

  const [extraInputs, setExtraInputs] = useState({
    field1: "",
    field2: "",
    field3: "",
  });

  useEffect(() => {
    const fetchRequest = async () => {
      const response = await UserData(order.order_id);
      if (response?.status === 200) {
        const apiData = response?.data;
        setExtraInputs({
          field1: apiData.full_name || "",
          field2: apiData.email || "",
          field3: apiData.phone || "",
        });
      }
    };

    fetchRequest();
  }, [order]);

  useEffect(() => {
    if (order?.order_id) {
      fetchOffers();
    }
  }, [order]);

  const toggleShipper = (offerId: number) => {
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === offerId
          ? {
              ...offer,
              isShipperOpen: !offer.isShipperOpen,
            }
          : { ...offer, isShipperOpen: false },
      ),
    );
    setSelectedOfferId(offerId);
  };

  const setShipperRef = useCallback(
    (offerId: number, ref: DynamicFormRef | null) => {
      if (ref) {
        shipperRefs.current[offerId] = ref;

        if (!dataLoadedRef.current[offerId]) {
          const offer = offers.find((o) => o.id === offerId);
          if (offer && offer.shipperData) {
            ref.setFormData(offer.shipperData);
            dataLoadedRef.current[offerId] = true;

            setOffers((prevOffers) =>
              prevOffers.map((o) =>
                o.id === offerId ? { ...o, isDataLoaded: true } : o,
              ),
            );
          }
        }
      }
    },
    [offers],
  );

  return (
    <div className={styles.price__quotation} ref={pageRef}>
      <Header />
      <div className={styles.price}>
        <div className={styles.input__name}>
          <h1 className={styles.title}>{t("price.information")}</h1>
          <InputSection
            inputs={[
              {
                name: "field1",
                label: "Full Name",
                placeholder: "Full Name",
                value: extraInputs.field1,
              },
              {
                name: "field2",
                label: "Email",
                placeholder: "Email",
                value: extraInputs.field2,
              },
              {
                name: "field3",
                label: "Phone number",
                placeholder: "+944-123-45-67",
                value: extraInputs.field3,
              },
            ]}
            onChange={handleExtraChange}
          />
          <div className={styles.input__list}>
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
                required
              />
            </div>
          </div>
        </div>

        <GetExpandableSection
          unCode=""
          setUnCode={() => {}}
          msDs={null}
          setMsDs={() => {}}
          msDsPictures={[]}
          setMsDsPictures={() => {}}
          dangerous={false}
          setDangerous={() => {}}
        />

        <GetPackagingForm
          onDataChange={() => {}}
          onRoutesChange={() => {}}
          onStackableChange={() => {}}
          onInRowChange={() => {}}
          onContainerProvisionChange={() => {}}
          onWagonProvisionChange={() => {}}
          onTransportationTypeChange={() => {}}
          onWagonTypeChange={() => {}}
        />

        <h1 className={styles.period}>Transport Period</h1>
        <div className={styles.date}>
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className={styles.agree_table}>
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className={styles.offerContainer}>
                <div className={styles.offerHeader}>
                  <h3>Commercial offer - {offer.id}</h3>
                  <div className={styles.offerActions}>
                    <Button
                      onClick={() => toggleShipper(offer.id)}
                      text={offer.isShipperOpen ? "Close Shipper" : "Agree"}
                      viewType="green__light"
                    />
                    <Button
                      text="Note"
                      viewType="dark-green"
                      onClick={() => handleEditClick(offer.id)}
                    />
                  </div>
                </div>
                <Table
                  headers={[
                    { name: "Services" },
                    { name: "Location" },
                    { name: "Transport Mode" },
                    { name: "From" },
                    { name: "To" },
                    { name: "Transport Type" },
                    { name: "Payload" },
                    { name: "Total Quantity" },
                    { name: "Transportation Time" },
                  ]}
                >
                  {Array.isArray(offer.service) && offer.service.length > 0 ? (
                    offer.service.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name_of_service}</td>
                        <td>{item.location}</td>
                        <td>{item.transport_mode}</td>
                        <td>{item.from}</td>
                        <td>{item.to}</td>
                        <td>{item.transport_type}</td>
                        <td>{item.payload}</td>
                        <td>{item.total_quantity}</td>
                        <td>{item.estimated_transport_time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        No services available
                      </td>
                    </tr>
                  )}
                </Table>

                <div className={styles.amountInfo}>
                  <div className={styles.amountRow}>
                    <span>Amount</span>
                    <span>{offer.amount}$</span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>VAT</span>
                    <span>{offer.vat}$</span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>Total Amount</span>
                    <span>{offer.total_amount}$</span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>Per Ton Price</span>
                    <span>{offer.per_ton_price}$</span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>Transportation Time</span>
                    <span>{offer.transportation_time}days</span>
                  </div>
                </div>

                {offer.isShipperOpen && (
                  <div className={styles.shipperSection}>
                    <Shipper
                      ref={(ref) => setShipperRef(offer.id, ref)}
                      key={`shipper-${offer.id}-${offer.isDataLoaded}`}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <Table
              headers={[
                { name: "Services" },
                { name: "Location" },
                { name: "Transport Mode" },
                { name: "From" },
                { name: "To" },
                { name: "Transport Type" },
                { name: "Payload" },
                { name: "Total Quantity" },
                { name: "Transportation Time" },
              ]}
            >
              <tr>
                <td
                  colSpan={9}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  There is no offer for the order
                </td>
              </tr>
            </Table>
          )}
        </div>
        <div className={styles.note}>
          <label className={styles.label}>Note</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Your note here"
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
          />
        </div>

        <div className={styles.button}>
          <Button onClick={rejectOffer} text="Reject" viewType="red" />
          <Button
            onClick={sendSelectedOffer}
            text="Send"
            viewType="dark-green"
          />
          <Button
            onClick={EditOffer}
            text="Send to Edit"
            viewType="dark-green"
          />
        </div>
      </div>

      {modal && (
        <Note
          modalClose={(isRender: boolean, noteText?: string) => {
            if (isRender && noteText && modal.offerId) {
              handleNoteSave(modal.offerId, noteText);
            }
            setModal(null);
          }}
          existingNote={modal.offerId ? offerNotes[modal.offerId] : ""}
        />
      )}
    </div>
  );
};

export default CustomerInformation;
