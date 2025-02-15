import {
  invoiceDocument,
  invoiceHead,
  invoiceTable,
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
import { getOrderInstructorDetailRequest } from "@/features/dashboard/services/order.service.ts";
import Modal from "@/components/Modal/Modal.tsx";
import { toast } from "react-toastify";
import { errorMessageHandler } from "@/libs/error.ts";
import { InstructionModel } from "@/features/dashboard/models/order.model.ts";

const InstructionPdf = ({
  id,
  modalClose,
}: {
  id: number;
  modalClose: () => void;
}) => {
  const { setLoader } = useContext(LoaderContext);

  const [order, setOrder] = useState<InstructionModel>();

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

  const getEditOrder = async () => {
    setLoader(true);
    const { status, data } = await getOrderInstructorDetailRequest(id);

    if (status === 200) {
      setOrder(data);
      console.log(order);
      setLoader(false);
    } else toast.error(errorMessageHandler(data));
  };

  const InstructionPDF = () => {
    return (
      <Document pageMode={"fullScreen"} style={invoiceDocument.document}>
        <Page size="A4" style={invoiceDocument.page}>
          {/* PDF Header START */}
          <View>
            <Image style={invoiceHead.header__logo} src={logo} />
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: 12,
                fontWeight: 700,
                margin: "20px 0 0 0",
                textAlign: "center",
              }}
            >
              Инструкция по заполнению ж/д накладной
            </Text>
          </View>
          {/* PDF Header END */}

          {/* PDF Table START */}
          <View style={invoiceTable.table}>
            <Text
              style={{
                fontFamily: "Roboto",
                fontSize: 10,
                textAlign: "center",
              }}
            >
              Сообщаем инструкцию по заполнению ж.д. накладных на ноябрь 2021
              года
            </Text>
            {/* Table Header START */}
            <View
              style={[
                invoiceTable.tableHeader,
                {
                  flexDirection: "row",
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: 10,
                  padding: "4px 8px",
                }}
              >
                Накладной указать для отправки контейнера
              </Text>
            </View>
            {/* Table Header END */}

            {/* Table Body START */}
            <View
              style={{
                flexDirection: "column",
              }}
            >
              {/* Qrafa 1 */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 1 отправитель
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_1}
                </Text>
              </View>

              {/* Qrafa 2 */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 2
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_2}
                </Text>
              </View>

              {/*  Qrafa 4  */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 4 получатель
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_4}
                </Text>
              </View>

              {/*  Qrafa 5  */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 5
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_5}
                </Text>
              </View>

              {/*  Qrafa 6  */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 6
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_6}
                </Text>
              </View>

              {/*  Qrafa 15  */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 15
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_15}
                </Text>
              </View>

              {/* Qrafa 7 */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 7
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_7}
                </Text>
              </View>

              {/* Qrafa 23 */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 3,23
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_23}
                </Text>
              </View>

              {/* Qrafa 25 */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 3,25
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_25}
                </Text>
              </View>

              {/* Qrafa 22 */}
              <View
                style={{
                  flexDirection: "row",
                  border: "1px solid #000",
                }}
              >
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "30%",
                    borderRight: "1px solid #000",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  Графа 22
                </Text>
                <Text
                  style={{
                    padding: "4px 8px",
                    width: "70%",
                    fontFamily: "Roboto",
                    fontSize: 10,
                  }}
                >
                  {order?.qrafa_22}
                </Text>
              </View>
            </View>
            {/* Table Body END */}
          </View>
          {/* PDF Table END */}

          {/* PDF List START */}
          <View
            style={{ margin: "10px 0 0", flexDirection: "column", gap: "5px" }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                Просим точно указать коды экспедитора в перевозочных документах
                СМГС, за правильность оформления перевозочных документов СМГС
                ответственность несет грузоотправитель.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                после оформления перевозочных документов в течение 3-х дней
                необходимо предоставить отгрузочную информацию на электронный
                адрес sales@adycontainer.com
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                <Text>Инструкция действительна до 31.12.2021 года.</Text>
                <Text>
                  Выделенные коды действительный только на указанные перевозки.
                </Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  fontFamily: "Roboto",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                в случае неиспользования кодов в указанные сроки, предоставить
                Экспедитору отказное письмо и справку со станции отправления,
                заверенную подписью начальника станции и штемпелем станции.
              </Text>
            </View>
          </View>
          {/* PDF List END */}

          <Text
            style={{
              fontFamily: "Roboto",
              fontSize: 10,
              fontWeight: 700,
              margin: "20px 0 0 0",
            }}
          >
            Начальник Коммерческого Отдела
          </Text>
        </Page>
      </Document>
    );
  };

  useEffect(() => {
    getEditOrder().catch(() => {});
  }, []);

  return (
    <Modal modalClose={modalClose}>
      <PDFViewer style={{ width: "600px", height: "800px" }}>
        <InstructionPDF />
      </PDFViewer>
    </Modal>
  );
};

export default InstructionPdf;
