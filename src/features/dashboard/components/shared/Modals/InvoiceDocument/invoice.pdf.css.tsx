import { StyleSheet } from "@react-pdf/renderer";

export const invoiceDocument = StyleSheet.create({
  document: {
    width: "794px",
    height: "100%",
    backgroundColor: "#fff",
  },
  page: {
    width: "100%",
    height: "100%",
    padding: "60px 60px 60px",
  },
});

export const invoiceHead = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  header__logo: {
    width: "30%",
  },
  header__text: {
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0 30px 0 0",
  },
});

export const invoiceDetail = StyleSheet.create({
  invoice: {
    margin: "30px 0 0 0",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "20px",
  },
  invoice__detail: {
    width: "100%",
    fontSize: "16px",
    flexDirection: "column",
    gap: "5px",
  },
  invoice__detail__item: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "12px",
    fontWeight: "normal",
  },
});

export const invoiceTable = StyleSheet.create({
  table: {
    margin: "30px 0 0",
    width: "100%",
  },
  tableHeader: {
    width: "100%",
    flexDirection: "row",
    border: "1px solid #DEDEDE",
  },
  headerCell: {
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    borderRight: "1px solid #DEDEDE",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    textAlign: "center",
  },
  col1: { flex: 1 }, // %10
  col2: { flex: 3 }, // %40
  col3: { flex: 2 }, // %10
  col4: { flex: 2 }, // %20
  col5: { flex: 2 }, // %10
  col6: { flex: 2 }, // %10
  tableBorder: {
    border: "1px solid #DEDEDE",
  },
  footer: {
    width: "100%",
  },
  footerRow: {
    flexDirection: "row",
  },
  footerCell: {
    padding: 5,
    fontSize: 10,
    textAlign: "center",
  },
  fullWidthRow: {
    flexDirection: "row",
    textAlign: "center",
  },
  fullWidthCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export const invoiceFooter = StyleSheet.create({
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: "center",
    borderTop: "1px solid #000",
    paddingTop: 10,
  },
  bold: {
    fontWeight: "bold",
  },
});

export const invoiceValidateDetail = StyleSheet.create({
  box: {
    width: "100%",
    margin: "30px 0 20px 0",
    flexDirection: "column",
    gap: "5px",
  },
  item: {
    fontSize: 10,
    fontFamily: "Roboto",
    fontWeight: "bold",
    width: "100%",
    flexDirection: "row",
    gap: "3px",
  },
});
