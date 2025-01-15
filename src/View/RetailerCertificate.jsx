import React from "react";
import { PDFViewer, StyleSheet } from "@react-pdf/renderer";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";
import RetailerPdf from "../component/RetailerPdf";

const styles = StyleSheet.create({
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
});

const RetailerCertificate = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  return (
    <PDFViewer style={styles.viewer}>
      <RetailerPdf user={user} />
    </PDFViewer>
  );
};

export default RetailerCertificate;
