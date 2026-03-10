import {
  invoiceDetail,
  invoiceDocument,
  invoiceFooter,
  invoiceHead,
  invoiceTable,
  invoiceValidateDetail,
} from "./invoice.pdf.css.tsx";
import logo from "@/assets/pdf/logo.png";
import {
  Page,
  Document,
  View,
  Text,
  Font,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import Roboto from "@/assets/fonts/Roboto/Roboto-Regular.ttf";
import RobotoBold from "@/assets/fonts/Roboto/Roboto-Bold.ttf";
import { useContext, useEffect, useState } from "react";
import { LoaderContext } from "@/contexts/LoaderContext.tsx";
import Modal from "@/components/Modal/Modal.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { InvoiceModel } from "@/features/dashboard/models/order.model.ts";
import mohur from "@/assets/images/shared/mohur.png";
import { getExtraChangeInvoice } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: Roboto,
      fontWeight: "normal",
    },
    {
      src: RobotoBold,
      fontWeight: "bold",
    },
  ],
});

const InvoicePdf = ({
  servicesId,
  id,
  modalClose,
}: {
  servicesId: number | null;
  id: number;
  modalClose: () => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [orderModel, setOrderModel] = useState<InvoiceModel>();
  const [loading, setLoading] = useState(true);

  const getEditOrder = async () => {
    setLoader(true);
    setLoading(true);

    console.log("Fetching invoice for order ID:", id);

    const { status, data } = await getExtraChangeInvoice(servicesId, id);

    console.log("API Response:", { status, data });

    if (status === 200) {
      const transformedData = {
        ...data,
        services: data.services
          ? Array.isArray(data.services)
            ? data.services
            : [data.services]
          : [],
      };
      setOrderModel(transformedData);
    } else {
      toast.error(errorMessageHandler(data));
    }

    setLoader(false);
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getEditOrder();
    }
  }, [id]);

  const InvoicePDF = () => {
    if (!orderModel) {
      return null;
    }

    return (
      <Document>
        <Page size="A4" style={invoiceDocument.page}>
          {/* PDF Header START */}
          <View style={invoiceHead.header}>
            <Image style={invoiceHead.header__logo} src={logo} />
            <Text style={invoiceHead.header__text}>INVOICE</Text>
          </View>
          {/* PDF Header END */}

          {/* PDF Invoice START */}
          <View style={invoiceDetail.invoice}>
            <View style={invoiceDetail.invoice__detail}>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>To:</Text>
                <Text>{orderModel?.to}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>TIN:</Text>
                <Text>{orderModel?.tin}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Address:</Text>
                <Text>{orderModel?.address}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Telefon:</Text>
                <Text>{orderModel?.telephone}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Email:</Text>
                <Text>{orderModel?.email}</Text>
              </View>
            </View>
            <View style={invoiceDetail.invoice__detail}>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Date:</Text>
                <Text>{orderModel?.date}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Invoice No:</Text>
                <Text>{orderModel?.invoice_is_valid}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Order No:</Text>
                <Text>{orderModel?.orderNo}</Text>
              </View>
              <View style={invoiceDetail.invoice__detail__item}>
                <Text>Contract No:</Text>
                <Text>{orderModel?.contractNo}</Text>
              </View>
            </View>
          </View>
          {/* PDF Invoice END */}

          {/* PDF Table START */}
          <View style={invoiceTable.table}>
            {/* Table Header START */}
            <View style={invoiceTable.tableHeader}>
              <Text style={[invoiceTable.headerCell, invoiceTable.col1]}>
                No
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col2]}>
                Service Description
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col3]}>
                Amount
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col4]}>
                Price
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col5]}>
                Vat
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col6]}>
                Total
              </Text>
            </View>
            {/* Table Header END */}

            {/* Table Body START */}
            {orderModel?.services && orderModel.services.length > 0 ? (
              orderModel.services.map((row, index) => (
                <View key={index} style={[invoiceTable.tableRow]}>
                  <Text
                    style={[
                      invoiceTable.tableCell,
                      invoiceTable.col1,
                      invoiceTable.tableBorder,
                    ]}
                  >
                    {row.no}
                  </Text>
                  <Text
                    style={[
                      invoiceTable.tableCell,
                      invoiceTable.col2,
                      invoiceTable.tableBorder,
                    ]}
                  >
                    {row.service}
                  </Text>
                  <Text
                    style={[
                      invoiceTable.tableCell,
                      invoiceTable.col3,
                      invoiceTable.tableBorder,
                    ]}
                  >
                    ${row.Amount}
                  </Text>
                  <Text
                    style={[
                      invoiceTable.tableCell,
                      invoiceTable.col4,
                      invoiceTable.tableBorder,
                    ]}
                  >
                    ${row.price}
                  </Text>
                  <Text
                    style={[
                      invoiceTable.tableCell,
                      invoiceTable.col5,
                      invoiceTable.tableBorder,
                    ]}
                  >
                    ${row.vat}
                  </Text>
                  <Text
                    style={[
                      invoiceTable.tableCell,
                      invoiceTable.col6,
                      invoiceTable.tableBorder,
                    ]}
                  >
                    ${row.total}
                  </Text>
                </View>
              ))
            ) : (
              <View style={[invoiceTable.tableRow]}>
                <Text
                  style={[
                    invoiceTable.tableCell,
                    { width: "100%", textAlign: "center" },
                    invoiceTable.tableBorder,
                  ]}
                >
                  No services available
                </Text>
              </View>
            )}
            {/* Table Body END */}

            {/* Footer */}
            <View style={invoiceTable.footer}>
              <View style={invoiceTable.footerRow}>
                <Text
                  style={[invoiceTable.footerCell, invoiceTable.col1]}
                ></Text>
                <Text
                  style={[invoiceTable.footerCell, invoiceTable.col2]}
                ></Text>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.col3,
                    invoiceTable.tableBorder,
                  ]}
                >
                  Amount
                </Text>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.tableBorder,
                    { width: "22.5%" },
                  ]}
                >
                  $ <Text>{orderModel?.amount}</Text>
                </Text>
              </View>

              <View style={invoiceTable.footerRow}>
                <Text
                  style={[invoiceTable.footerCell, invoiceTable.col1]}
                ></Text>
                <Text
                  style={[invoiceTable.footerCell, invoiceTable.col2]}
                ></Text>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.col3,
                    invoiceTable.tableBorder,
                  ]}
                >
                  Vat
                </Text>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.tableBorder,
                    { width: "22.5%" },
                  ]}
                >
                  $ {orderModel?.vat}
                </Text>
              </View>
              <View style={invoiceTable.footerRow}>
                <Text
                  style={[invoiceTable.footerCell, invoiceTable.col1]}
                ></Text>
                <Text
                  style={[invoiceTable.footerCell, invoiceTable.col2]}
                ></Text>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.col3,
                    invoiceTable.tableBorder,
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.tableBorder,
                    { width: "22.5%" },
                  ]}
                >
                  $ <Text> {orderModel?.total}</Text>
                </Text>
              </View>
            </View>
          </View>
          {/* PDF Table END */}

          {/* Invoice Detail START */}
          <View style={invoiceValidateDetail.box}>
            <View style={{ flexDirection: "row", fontSize: 10, gap: "3px" }}>
              <Text>Payment terms:</Text>
              <Text>{orderModel?.payment_terms}</Text>
            </View>
            <View style={invoiceValidateDetail.item}>
              <Text>Other conditions:</Text>
              <Text>{orderModel?.other_conditions}</Text>
            </View>
          </View>
          {/* Invoice Detail END */}

          {/* Bank START */}
          <View
            style={{
              margin: "50px 0 0 0",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ width: "50%", flexDirection: "column", gap: "5px" }}>
              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Bank:
                </Text>
                <Text style={{ fontSize: 10 }}>{orderModel?.bank?.Bank}</Text>
              </View>

              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  SWIFT:
                </Text>
                <Text style={{ fontSize: 10 }}>{orderModel?.bank?.SWIFT}</Text>
              </View>

              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Correspondent bank:
                </Text>
                <Text style={{ fontSize: 10, marginLeft: 25 }}>
                  {orderModel?.bank?.["Correspondent bank"]}
                </Text>
              </View>

              {orderModel?.bank &&
                Object.keys(orderModel.bank)
                  .filter((key) => key.startsWith("Correspondent account"))
                  .map((accountKey, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", gap: "5px" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                        }}
                      >
                        {accountKey.replace(/[0-9]/g, "")}:
                      </Text>
                      <Text style={{ fontSize: 10 }}>
                        {
                          orderModel.bank[
                            accountKey as keyof typeof orderModel.bank
                          ]
                        }
                      </Text>
                    </View>
                  ))}

              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Bank TIN No:
                </Text>
                <Text style={{ fontSize: 10 }}>
                  {orderModel?.bank?.["Bank TIN"]}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Name of Beneficiary customer:
                </Text>
                <Text style={{ fontSize: 10, marginLeft: 45 }}>
                  {orderModel?.bank?.["Beneficiary name"]}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Acc. No. Of Beneficiary Customer:
                </Text>
                <Text style={{ fontSize: 10, marginLeft: 75 }}>
                  {orderModel?.bank?.["Account Number"]}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: "5px" }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  TIN No:
                </Text>
                <Text style={{ fontSize: 10 }}>{orderModel?.bank?.TIN}</Text>
              </View>
            </View>
            <View style={{ width: "30%" }}>
              <Image src={mohur} style={{ width: "100%" }} />
            </View>
          </View>
          {/* Bank END */}

          {/* PDF Footer START */}
          <View style={invoiceFooter.footer}>
            <Text style={invoiceFooter.bold}>ALLIANCE MULTIMODAL</Text>
            <Text>Port Baku Towers | 153, Neftchilar Avenue</Text>
            <Text>Az1010, Baku, Azerbaijan</Text>
            <Text>+994 12-599-11-39/40</Text>
            <Text>
              www.alliancemultimodal.com | info@alliancemultimodal.com
            </Text>
          </View>
          {/* PDF Footer END */}

          {/* Second Table START */}
          <View style={[invoiceTable.table, { marginTop: 20 }]}>
            {/* Table Header */}
            <View style={invoiceTable.tableHeader}>
              <Text style={[invoiceTable.headerCell, invoiceTable.col1]}>
                No
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col2]}>
                Transport No
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col3]}>
                Full/Empty
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col4]}>
                Container
              </Text>
              <Text style={[invoiceTable.headerCell, invoiceTable.col5]}>
                Owner
              </Text>
            </View>

            {/* Table Body */}
            {orderModel?.containers?.map((item, index) => (
              <View key={index} style={[invoiceTable.tableRow]}>
                <Text
                  style={[
                    invoiceTable.tableCell,
                    invoiceTable.col1,
                    invoiceTable.tableBorder,
                  ]}
                >
                  {item.no}
                </Text>
                <Text
                  style={[
                    invoiceTable.tableCell,
                    invoiceTable.col2,
                    invoiceTable.tableBorder,
                  ]}
                >
                  {item.transport_no}
                </Text>
                <Text
                  style={[
                    invoiceTable.tableCell,
                    invoiceTable.col3,
                    invoiceTable.tableBorder,
                  ]}
                >
                  {item.full_empty}
                </Text>
                <Text
                  style={[
                    invoiceTable.tableCell,
                    invoiceTable.col4,
                    invoiceTable.tableBorder,
                  ]}
                >
                  {item.container}
                </Text>
                <Text
                  style={[
                    invoiceTable.tableCell,
                    invoiceTable.col5,
                    invoiceTable.tableBorder,
                  ]}
                >
                  {item.owner}
                </Text>
              </View>
            ))}
          </View>
          {/* Second Table END */}
        </Page>
      </Document>
    );
  };

  if (loading) {
    return (
      <Modal modalClose={modalClose}>
        <div
          style={{
            width: "700px",
            height: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <p>Loading invoice data...</p>
        </div>
      </Modal>
    );
  }

  if (!orderModel) {
    return (
      <Modal modalClose={modalClose}>
        <div
          style={{
            width: "700px",
            height: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <h3>No invoice data available</h3>
        </div>
      </Modal>
    );
  }

  return (
    <Modal modalClose={modalClose}>
      <PDFViewer style={{ width: "700px", height: "800px" }}>
        <InvoicePDF />
      </PDFViewer>
    </Modal>
  );
};

export default InvoicePdf;
