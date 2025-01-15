// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Image,
//   Font,
// } from "@react-pdf/renderer";
// import {
//   Logo,
//   globeIcon,
//   impsguruStamp,
//   iphoneIcon,
//   locIcon,
//   loginPage1,
//   messIcon,
// } from "../iconsImports";
// import { dilliPaysign } from "../iconsImports";
// import { getEnv } from "../theme/setThemeColor";
// import { getFirmAddress } from "../theme/setThemeColor";
// import robotoBold from "../fonts/Roboto-Bold.ttf";
// import { ddmmyyyy } from "../utils/DateUtils";
// import moment from "moment";

// // Font.register(`https://fonts.googleapis.com/css2?family=Poppins&display=swap`, {
// //   family: "Poppins-Light",
// //   weight: "100,200,300",
// // });
// Font.register({
//   family: "roboto-bold",
//   src: robotoBold,
// });

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#fff",
//     padding: 50,
//     position: "relative",
//   },
//   section: {
//     marginBottom: "30px",
//   },
//   viewer: {
//     width: window.innerWidth, //the pdf viewer will take up all of the width and height
//     height: window.innerHeight,
//   },
//   image: {
//     width: "160px",
//   },
//   stamp_image: {
//     width: "100px",
//     marginLeft: "-2px",
//   },
//   bigtext: {
//     fontSize: "200px",
//     letterSpacing: "0.4px",
//   },
//   text: {
//     fontSize: "11px",
//     letterSpacing: "0.4px",
//     marginBottom: "30px",
//   },
//   bold: {
//     fontWeight: 900,
//   },
// });
// const BcPdf = ({ user }) => {
//   const envName = getEnv();

//   return (
//     <Document>
//       {/* page 1 */}
//       <Page size="A4" style={styles.page}>
//         <View style={styles.section}>
//           <Image src={loginPage1} style={styles.image} />
//         </View>

//         <Text style={styles.text}>
//           Letter Date: {moment(Date.now()).format("Do MMM YYYY")}
//         </Text>

//         <Text
//           style={{
//             textAlign: "center",
//             textTransform: "uppercase",
//             textDecoration: "underline",
//             fontSize: "15px",
//             marginBottom: "35px",
//           }}
//         >
//           TO WHOMSOEVER IT MAY CONCERN
//         </Text>

//         <Text style={styles.text}>
//           DILLIPAY TECHNOLOGIES LIMITED s Private Limited (“{envName}”) a
//           company incorporated under The Companies Act, 1956 and having its
//           registered office at {getFirmAddress()} is a Business Correspondent
//           with BCs.
//         </Text>

//         <Text style={styles.text}>
//           {envName} is authorized by the above BCs to act as a Business
//           Correspondent and appoint Distribution Partners to deliver mainstream
//           financial and citizen services to Customers under the guidelines
//           issued by RBI vide RBI/2010-11/217 DBOD. No.BL.BC.43/22.01.009/2010-11
//           dated September 28, 2010.
//         </Text>

//         <Text style={styles.text}>
//           {envName} has authorised{" "}
//           <Text style={{ fontFamily: "roboto-bold" }}>
//             {user?.name?.toUpperCase()}
//           </Text>{" "}
//           of{" "}
//           <Text style={{ fontFamily: "roboto-bold" }}>
//             {user?.establishment?.toUpperCase()}
//           </Text>{" "}
//           as a Distribution Partner to undertake cash management activities like
//           cash deposits and cash withdrawals for the customers
//         </Text>

//         <Text
//           style={{
//             fontSize: "11px",
//             fontFamily: "roboto-bold",
//             letterSpacing: "0.4px",
//             marginBottom: "50px",
//           }}
//         >
//           In view of the recent Coronavirus (COVID 19) outbreak, banking
//           services provided by banks & business correspondents have been
//           classified as “Essential Services” according to the notification
//           released by Ministry of Home Affairs’ Order No. 40-3/2020-DM-I (A)
//           Dated 24 March 2020, Section E, sub-clause (b) to Clause 4.
//         </Text>

//         <Image src={dilliPaysign} style={styles.stamp_image} />

//         <Text style={styles.text}>Authorised Signatory</Text>

//         <Text style={styles.text}>Enclosures: 1. 194N Letter</Text>

//         {/* footer */}
//         <View style={{ position: "absolute", bottom: "16px", left: "48px" }}>
//           <Text
//             style={{ fontSize: "8px", color: "#00693E", marginBottom: "0px" }}
//           >
//             DILLIPAY TECHNOLOGIES LIMITED s Private Limited |{" "}
//             <Text style={{ marginBottom: "0px" }}>
//               CIN: U74999DL2017PTC316608
//             </Text>
//           </Text>
//           <Text style={{ marginBottom: "10px", color: "#00693E" }}>
//             __________________________________________________
//           </Text>

//           <View
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               flexDirection: "row",
//               alignItems: "center",
//               position: "",
//             }}
//           >
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <Image
//                 src={locIcon}
//                 style={{ width: "18px", marginRight: "8px" }}
//               />
//               <Text
//                 style={{
//                   fontSize: "8px",
//                   color: "#00693E",
//                   marginBottom: "0px",
//                 }}
//               >
//                 {`Plot No.5 , Second Floor ,Pocket-5, Rohini Sector 24,
//                  New Delhi 110085`}
//               </Text>
//             </View>
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <Image
//                 src={iphoneIcon}
//                 style={{ width: "15px", marginRight: "8px" }}
//               />
//               <Text
//                 style={{
//                   fontSize: "8px",
//                   color: "#00693E",
//                   marginBottom: "0px",
//                 }}
//               >
//                 9355128199
//               </Text>
//             </View>
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <Image
//                 src={messIcon}
//                 style={{ width: "15px", marginRight: "8px" }}
//               />
//               <Text
//                 style={{
//                   fontSize: "8px",
//                   color: "#00693E",
//                   marginBottom: "0px",
//                 }}
//               >
// support@dillipay.com
//               </Text>
//             </View>
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <Image
//                 src={globeIcon}
//                 style={{ width: "15px", marginRight: "8px" }}
//               />
//               <Text
//                 style={{
//                   fontSize: "8px",
//                   color: "#00693E",
//                   marginBottom: "0px",
//                 }}
//               >
// app.dillpay.com          
//         </Text>
//             </View>
//           </View>
//         </View>
//       </Page>
//       {/* page 2 */}
    
//       {/* page 3 */}
     
//     </Document>
//   );
// };

// export default BcPdf;
