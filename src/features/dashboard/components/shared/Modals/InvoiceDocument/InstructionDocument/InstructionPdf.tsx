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

  const InstructionPdf = () => {
    if (!orderModel) {
      return null;
    }

    return (
      <Document>
        <Page size="A4" style={invoiceDocument.page}>
          {/* PDF Header START */}
          <View style={invoiceHead.header}>
            <Image style={invoiceHead.header__logo} src={logo} />
          </View>
          {/* PDF Header END */}

          {/* Invoice Detail START */}
          <View style={invoiceValidateDetail.box}>
            <View style={invoiceValidateDetail.item}>
              <Text>Инструкция по заполнению ж/д накладной</Text>
            </View>
            <View style={invoiceValidateDetail.item}>
              <Text>
                Сообщаем инструкцию по заполнению ж.д. накладных на ноябрь 2021
                года
              </Text>
            </View>
          </View>
          {/* Invoice Detail END */}

          {/* PDF Table START */}
          <View style={invoiceTable.footer}>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Border Crossing Points
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text>{orderModel?.border_crossing_points}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                From
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                {orderModel?.from}
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                to
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.to}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Harmonized System Code
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.harmonized_system_code}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Owner
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.owner}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Packing type
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.packing_type}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Padcode
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.padcode}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Shipper
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.shipper}</Text>
              </Text>
            </View>
            <View style={invoiceTable.footerRow}>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.col3,
                  invoiceTable.tableBorder,
                ]}
              >
                Vaqon No
              </Text>
              <Text
                style={[
                  invoiceTable.footerCell,
                  invoiceTable.tableBorder,
                  { width: "50%" },
                ]}
              >
                <Text> {orderModel?.vaqon_no}</Text>
              </Text>
            </View>
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
        <InstructionPdf />
      </PDFViewer>
    </Modal>
  );
};

export default InstructionPdf;
