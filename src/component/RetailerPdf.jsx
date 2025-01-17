import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { dilliPaysign, Logo, signAvatars } from "../iconsImports";

import robotoBold from "../fonts/Roboto-Bold.ttf";
import { cBottom, cTop, impsguruStamp, loginPage1 } from "../iconsImports";
Font.register({
  family: "roboto-bold",
  src: robotoBold,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    position: "relative",
  },
  section: {
    marginBottom: "30px",
  },
  viewer: {
    width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  imageTop: {
    width: "400px",
    postion: "absolute",
    top: "1px",
    right: "1px",
  },
  imageBottom: {
    width: "160px",
  },

  stamp_image: {
    width: "200px",
    marginLeft: "-15px",
  },
  text: {
    fontSize: "11px",
    letterSpacing: "0.4px",
    marginBottom: "30px",
  },
  bold: {
    fontWeight: 900,
  },
});
const RetailerPdf = ({ user }) => {
  return (
    <Document>
    <Page style={styles.page} orientation="landscape" size="B5">
      <View style={{ postion: "relative" }}>
        <Image
          src={cTop}
          style={{
            position: "absolute",
            top: "0px",
            right: "-80px",
            width: "550px",
          }}
        />
        <Image
          src={Logo}
          style={{
            width: "160px",
            position: "absolute",
            top: "25px",
            left: "35px",
          }}
        />
      </View>
      <View
        style={{
          position: "relative",
          top: "120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: "50px",
            letterSpacing: "1px",
            color: "#1D2B5D",
            fontFamily: "roboto-bold",
          }}
        >
          CERTIFICATE
        </Text>
        <Text
          style={{
            fontSize: "15px",
            letterSpacing: "0.4px",
            marginTop: "5px",
            opacity: "0.7",
          }}
        >
          Of Appointment
        </Text>
        <Text
          style={{
            fontSize: "30px",
            letterSpacing: "0.4px",
            marginVertical: "20px",
            marginBottom: "8px",
            fontFamily: "roboto-bold",
          }}
        >
          {user?.name}
        </Text>
        <Text
          style={{
            fontSize: "12px",
            letterSpacing: "0.4px",
            marginVertical: "6px",
            opacity: "0.7",
          }}
        >
          is an Authorized{" "}
          <Text
            style={{
              fontSize: "12px",
              fontFamily: "roboto-bold",
              letterSpacing: "0.4px",
            }}
          >
            {user?.role === "Ad"
              ? "Distributor"
              : user?.role === "Ret"
              ? "Retailer"
              : user?.role === "Dd"
              ? "Direct Dealer"
              : ""}
          </Text>
        </Text>
        <Text
          style={{
            fontSize: "12px",
            letterSpacing: "0.4px",
            marginVertical: "6px",
            opacity: "0.7",
          }}
        >
          Mobifast Solutions Pvt Ltd
        </Text>
        <Text
          style={{
            fontSize: "12px",
            letterSpacing: "0.4px",
            marginVertical: "6px",
            opacity: "0.7",
          }}
        >
          for providing Banking{" "}
          <Text
            style={{
              fontSize: "12px",
              fontFamily: "roboto-bold",
              letterSpacing: "0.4px",
            }}
          >
            Business Correspondent services
          </Text>{" "}
          during{" "}
          <Text
            style={{
              fontSize: "12px",
              fontFamily: "roboto-bold",
              letterSpacing: "0.4px",
            }}
          >
            FY 2023- 2024
          </Text>
        </Text>
      </View>
      <View style={{ postion: "relative" }}>
        <Image
          src={cBottom}
          style={{
            position: "absolute",
            bottom: "-280px",
            left: "-90px",
            width: "550px",
          }}
        />
      </View>
      <View style={{ postion: "relative" }}>
        <Image
          src={impsguruStamp}
          style={{
            position: "absolute",
            bottom: "-250px",
            right: "50px",
            width: "200px",
          }}
        />
      </View>
    </Page>
  </Document>
  );
};

export default RetailerPdf;
