import {
  invoiceDocument,
  invoiceHead,
  invoiceTable,
  invoiceValidateDetail,
} from "../invoice.pdf.css.tsx";
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
import { InstructionModel } from "@/features/dashboard/models/order.model.ts";
import { getOrderInstructionDetailRequest } from "@/features/dashboard/services/CommercialManager/commercial.service.ts";

// ✅ Font register (sadece Roboto)
Font.register({
  family: "Roboto",
  fonts: [
    { src: Roboto, fontWeight: "normal" },
    { src: RobotoBold, fontWeight: "bold" },
  ],
});

const InstructionPdf = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: () => void;
}) => {
  const { setLoader } = useContext(LoaderContext);
  const [orderModel, setOrderModel] = useState<InstructionModel>();
  const [loading, setLoading] = useState(true);

  const getEditOrder = async () => {
    setLoader(true);
    setLoading(true);

    console.log("Fetching invoice for order ID:", id);

    const { status, data } = await getOrderInstructionDetailRequest(id);

    console.log("API Response:", { status, data });

    if (status === 200) {
      setOrderModel(data);
      console.log("Order model set:", data);
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

  const PdfContent = () => {
    if (!orderModel) return null;

    return (
      <Document>
        <Page size="A4" style={invoiceDocument.page}>
          {/* Header */}
          <View style={invoiceHead.header}>
            <Image style={invoiceHead.header__logo} src={logo} />
          </View>

          {/* Başlık */}
          <View style={invoiceValidateDetail.box}>
            <View style={invoiceValidateDetail.item}>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Инструкция по заполнению ж/д накладной
              </Text>
            </View>
            <View style={invoiceValidateDetail.item}>
              <Text style={{ fontFamily: "Roboto", fontSize: 12 }}>
                Сообщаем инструкцию по заполнению ж.д. накладных на ноябрь 2021
                года
              </Text>
            </View>
          </View>

          <View style={invoiceTable.footer}>
            {[
              {
                label: "Border Crossing Points",
                value: orderModel?.border_crossing_points,
              },
              { label: "From", value: orderModel?.from },
              { label: "To", value: orderModel?.to },
              {
                label: "Harmonized System Code",
                value: orderModel?.harmonized_system_code,
              },
              { label: "Owner", value: orderModel?.owner },
              { label: "Packing type", value: orderModel?.packing_type },
              { label: "Padcode", value: orderModel?.padcode },
              { label: "Shipper", value: orderModel?.shipper },
              { label: "Wagon No", value: orderModel?.vaqon_no },
            ].map((item, index) => (
              <View key={index} style={invoiceTable.footerRow}>
                <Text
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.col3,
                    invoiceTable.tableBorder,
                    {
                      fontFamily: "Roboto",
                      fontSize: 10,
                      fontWeight: "bold",
                      padding: "4px 8px",
                    },
                  ]}
                >
                  {item.label}
                </Text>
                <View
                  style={[
                    invoiceTable.footerCell,
                    invoiceTable.tableBorder,
                    {
                      width: "70%",
                      padding: "4px 8px",
                      display: "flex",
                      flexWrap: "wrap",
                      minHeight: "24px",
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: "Roboto",
                      fontSize: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {item.value || "-"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

  if (loading) {
    return (
      <Modal modalClose={modalClose}>
        <div
          style={{
            width: "600px",
            height: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        ></div>
      </Modal>
    );
  }

  if (!orderModel) {
    return (
      <Modal modalClose={modalClose}>
        <div
          style={{
            width: "600px",
            height: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <h3>No instruction data available</h3>
        </div>
      </Modal>
    );
  }

  return (
    <Modal modalClose={modalClose}>
      <PDFViewer style={{ width: "700px", height: "800px" }}>
        <PdfContent />
      </PDFViewer>
    </Modal>
  );
};

export default InstructionPdf;
