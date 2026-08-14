import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 9,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 32,
    backgroundColor: "#ffffff",
    color: "#000000",
  },

  // Kop Surat Resmi
  kopContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoContainer: {
    width: 52,
    height: 52,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSquare: {
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logoText: {
    fontFamily: "Times-Bold",
    color: "#000000",
    fontSize: 16,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  kopLine1: {
    fontFamily: "Times-Bold",
    fontSize: 13,
    color: "#000000",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  kopLine2: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: "#000000",
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 2,
  },
  kopLine3: {
    fontFamily: "Times-Roman",
    fontSize: 8.5,
    color: "#000000",
    textAlign: "center",
    marginTop: 3,
  },

  kopDividerThick: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    marginBottom: 2,
  },
  kopDividerThin: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
    marginBottom: 16,
  },

  // Judul Laporan
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  reportTitle: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  reportSubTitle: {
    fontFamily: "Times-Roman",
    fontSize: 9,
    color: "#000000",
    marginTop: 4,
  },

  // Tabel Resmi Hitam Putih
  table: {
    width: "100%",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  tableHeaderCell: {
    fontFamily: "Times-Bold",
    color: "#000000",
    fontSize: 8.5,
    paddingVertical: 5,
    paddingHorizontal: 4,
    textAlign: "center",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  tableCell: {
    fontFamily: "Times-Roman",
    fontSize: 8.5,
    paddingVertical: 4,
    paddingHorizontal: 4,
    textAlign: "center",
    color: "#000000",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },

  colNo: { width: "4%", borderLeftWidth: 1, borderColor: "#000000" },
  colNama: { width: "18%", textAlign: "left" },
  colUsia: { width: "7%" },
  colJK: { width: "5%" },
  colBB: { width: "7%" },
  colTB: { width: "7%" },
  colZBBU: { width: "10%" },
  colZTBU: { width: "10%" },
  colZBBTB: { width: "10%" },
  colStatus: { width: "12%", textAlign: "left" },
  colTgl: { width: "10%" },

  // Ringkasan
  summaryContainer: {
    marginTop: 2,
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
  },
  summaryTitle: {
    fontFamily: "Times-Bold",
    fontSize: 9.5,
    color: "#000000",
    marginBottom: 4,
  },
  summaryItem: {
    fontFamily: "Times-Roman",
    fontSize: 8.5,
    color: "#000000",
    marginBottom: 2,
  },

  // Blok Tanda Tangan
  ttdContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  ttdBox: {
    width: 220,
    alignItems: "flex-start",
  },
  ttdText: {
    fontFamily: "Times-Roman",
    fontSize: 9,
    color: "#000000",
    marginBottom: 2,
  },
  ttdSpacer: {
    height: 48,
  },
  ttdNama: {
    fontFamily: "Times-Bold",
    fontSize: 9.5,
    color: "#000000",
    textDecoration: "underline",
  },
  ttdNip: {
    fontFamily: "Times-Roman",
    fontSize: 8.5,
    color: "#000000",
    marginTop: 2,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Times-Roman",
    fontSize: 7.5,
    color: "#000000",
  },
});
