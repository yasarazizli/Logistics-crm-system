import {
  invoiceDetail,
  invoiceDocument,
  invoiceFooter,
  invoiceHead,
  invoiceTable,
  invoiceValidateDetail,
} from "@/features/dashboard/components/pages/Home/invoice.pdf.css.tsx";
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
import { getOrderInvoiceDetailRequest } from "@/features/dashboard/services/order.service.ts";
import Modal from "@/components/Modal/Modal.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { InvoiceModel } from "@/features/dashboard/models/order.model.ts";
import mohur from "@/assets/images/shared/mohur.png";

const InvoicePdf = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: () => void;
}) => {
  const { setLoader } = useContext(LoaderContext);

  const [order, setOrder] = useState<InvoiceModel>();

  const InvoicePDF = () => (
    <Document pageMode={"fullScreen"} style={invoiceDocument.document}>
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
              <Text>{order?.to}</Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>TIN:</Text>
              <Text>{order?.tin}</Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Address:</Text>
              <Text></Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Telefon:</Text>
              <Text>{order?.phone}</Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Email:</Text>
              <Text>{order?.email}</Text>
            </View>
          </View>
          <View style={invoiceDetail.invoice__detail}>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Date:</Text>
              <Text>{order?.date}</Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Invoice No:</Text>
              <Text>{order?.invoice_is_valid}</Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Order No:</Text>
              <Text>{order?.orderNo}</Text>
            </View>
            <View style={invoiceDetail.invoice__detail__item}>
              <Text>Contract No:</Text>
              <Text>{order?.contractNo}</Text>
            </View>
          </View>
        </View>
        {/* PDF Invoice END */}

        {/* PDF Table START */}
        <View style={invoiceTable.table}>
          {/* Table Header START */}
          <View style={invoiceTable.tableHeader}>
            <Text style={[invoiceTable.headerCell, invoiceTable.col1]}>No</Text>
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
              Total
            </Text>
          </View>
          {/* Table Header END */}

          {/* Table Body START */}
          {order?.service?.map((row, index) => (
            <View key={index} style={[invoiceTable.tableRow]}>
              <Text
                style={[
                  invoiceTable.tableCell,
                  invoiceTable.col1,
                  invoiceTable.tableBorder,
                ]}
              >
                {index + 1}
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
                {row.amount}
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
                ${row.total}
              </Text>
            </View>
          ))}
          {/* Table Body END */}

          {/* Footer 1. Row */}
          <View style={invoiceTable.footer}>
            {/* Footer 1. Row */}
            <View style={invoiceTable.footerRow}>
              <Text style={[invoiceTable.footerCell, invoiceTable.col1]}></Text>
              <Text style={[invoiceTable.footerCell, invoiceTable.col2]}></Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Subtotal
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "31.5%" },
                ]}
              >
                $ <Text>{calculateRowTotal(order?.service)}</Text>
              </Text>
            </View>

            {/* Footer 2. Row */}
            <View style={invoiceTable.footerRow}>
              <Text style={[invoiceTable.footerCell, invoiceTable.col1]}></Text>
              <Text style={[invoiceTable.footerCell, invoiceTable.col2]}></Text>
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
                  { width: "31.5%" },
                ]}
              >
                $15
              </Text>
            </View>
            {/* Footer Final Row (Merged All Columns) */}
          </View>
        </View>
        {/* PDF Table END */}

        {/* Invoice Detail START */}
        <View style={invoiceValidateDetail.box}>
          <View style={invoiceValidateDetail.item}>
            <Text>Invoice is valid till:</Text>
            <Text>01.12.2024</Text>
          </View>

          <View style={{ flexDirection: "row", fontSize: 10, gap: "10px" }}>
            <Text>Payment terms:</Text>
            <Text>
              1. In accordance with exchange rate of the Central Bank of the
              Republic of Azerbaijan for that day.
            </Text>
          </View>

          <View style={invoiceValidateDetail.item}>
            <Text>Other conditions:</Text>
            <Text>
              Dear customer! Please record INV number and date on your payment
              order.
            </Text>
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
              <Text style={{ fontSize: 10 }}>Pasha bank</Text>
            </View>

            <View style={{ flexDirection: "row", gap: "5px" }}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                SWIFT address
              </Text>
              <Text style={{ fontSize: 10 }}>Am Stadtpark 9, 1030 Vienna</Text>
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
              <Text style={{ fontSize: 10 }}>Am Stadtpark 9, 1030 Vienna</Text>
            </View>

            <View style={{ flexDirection: "row", gap: "5px" }}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                Correspondent. No. account:
              </Text>
              <Text style={{ fontSize: 10 }}>[Account Number]</Text>
            </View>
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
              <Text style={{ fontSize: 10 }}>[TIN Number]</Text>
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
              <Text style={{ fontSize: 10 }}>Alliance Multimodal</Text>
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
              <Text style={{ fontSize: 10 }}>[Account Number]</Text>
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
              <Text style={{ fontSize: 10 }}>[TIN Number]</Text>
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
          <Text>www.alliancemultimodal.com | info@alliancemultimodal.com</Text>
        </View>
        {/* PDF Footer END */}
      </Page>
    </Document>
  );

  Font.register({
    family: "Roboto",
    src: Roboto,
    fonts: [
      {
        src: Roboto,
      },
      {
        src: RobotoBold,
        fontWeight: 700,
      },
    ],
  });

  // Generator And Download PDF
  // const generateAndDownloadPDF = async () => {
  //   // React-PDF'nin PDF Blob'unu oluştur
  //   const blob = await pdf(<InvoicePDF />).toBlob();
  //
  //   // Blob için bir URL oluştur
  //   const url = URL.createObjectURL(blob);
  //
  //   // Bir indirme bağlantısı oluştur
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "invoice.pdf";
  //   document.body.appendChild(a);
  //
  //   // Bağlantıyı tetikleyerek indir
  //   a.click();
  //
  //   // Temizleme işlemi
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  const getEditOrder = async () => {
    setLoader(true);
    const { status, data } = await getOrderInvoiceDetailRequest(id);

    if (status === 200) {
      setOrder(data);
      // await generateAndDownloadPDF();
      setLoader(false);
    } else toast.error(errorMessageHandler(data));
  };
  const calculateRowTotal = (
    services:
      | {
          amount: number;
          price: number;
          service: string;
          total: number;
        }[]
      | undefined,
  ): number => {
    if (!services) return 0;

    let total = 0;

    services.forEach((service) => {
      total += Number(service.amount) * Number(service.price);
    });

    return total;
  };

  useEffect(() => {
    getEditOrder().catch(() => {});
  }, []);

  return (
    <Modal modalClose={modalClose}>
      <PDFViewer style={{ width: "600px", height: "800px" }}>
        <InvoicePDF />
      </PDFViewer>
    </Modal>
  );
};

export default InvoicePdf;
