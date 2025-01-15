// import { Box, Container, Typography, Paper } from "@mui/material";
// import React from "react";
// import RefundIcon from '@mui/icons-material/AttachMoney'; // Example icon
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // KYC Icon
// import ScheduleIcon from '@mui/icons-material/Schedule'; // Refund Process Icon

// const RefundPolicy = () => {
//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center', background: '#f9f9f9', borderRadius: 2, boxShadow: 3, padding: 4 }}>
//       <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#dc5f5f' }}>
//         Refund &amp; Policy
//       </Typography>
//       <Box
//         sx={{
//           width: "80px",
//           height: "8px",
//           backgroundColor: "#dc5f5f",
//           margin: "0 auto 2rem",
//           borderRadius: 1,
//         }}
//       />

//       <Paper elevation={5} sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#dc5f5f', mb: 1 }}>
//           Important Notice
//         </Typography>
//         <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
//           <RefundIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//           Once a User chooses to avail any service plan/offer announced by <strong>LINKSTECH SERVICES PRIVATE LIMITED S</strong> and agrees to buy that plan, such payment shall not be refunded by <strong>LINKSTECH SERVICES PRIVATE LIMITED S</strong> under any circumstances.
//         </Typography>
//       </Paper>

//       <Paper elevation={5} sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#dc5f5f', mb: 1 }}>
//           KYC Verification
//         </Typography>
//         <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
//           <VerifiedUserIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//           Post receipt of payment, <strong>LINKSTECH SERVICES PRIVATE LIMITED S</strong> will create a User ID only after successful KYC verification. If the KYC is unsuccessful, a User ID cannot be created.
//         </Typography>
//       </Paper>

//       <Paper elevation={5} sx={{ padding: 3, borderRadius: 3, mb: 3 }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#dc5f5f', mb: 1 }}>
//           Refund Process
//         </Typography>
//         <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
//           <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//           Transactions that fail due to issues directly attributable to <strong>LINKSTECH SERVICES PRIVATE LIMITED S</strong> will be refunded within 3-21 working days. Only the actual transaction amount will be refunded, excluding fees.
//         </Typography>
//       </Paper>

//       <Typography variant="body2" sx={{ color: '#666' }}>
//         For any queries, please contact our customer care.
//       </Typography>
//     </Container>
//   );
// };

// export default RefundPolicy;

import { Box, Container, Typography, Paper } from "@mui/material";
import React from "react";
import RefundIcon from "@mui/icons-material/AttachMoney";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ScheduleIcon from "@mui/icons-material/Schedule";

const RefundPolicy = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
        textAlign: "center",
        background: "#f9f9f9",
        borderRadius: 2,
        boxShadow: 5,
        padding: 4,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#dc5f5f", fontSize: "2.5rem" }}
      >
        Refund &amp; Policy
      </Typography>
      <Box
        sx={{
          width: "80px",
          height: "8px",
          backgroundColor: "#dc5f5f",
          margin: "0 auto 2rem",
          borderRadius: 1,
        }}
      />

      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            mb: 3,
            width: "100%",
            maxWidth: "600px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "120%",
              height: "120%",
              background: "rgba(220, 95, 95, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#dc5f5f", mb: 1, zIndex: 1 }}
          >
            Important Notice
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.6, zIndex: 1 }}
          >
            <RefundIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Once a User chooses to avail any service plan/offer announced by{" "}
            <strong>DILLIPAY TECHNOLOGIES LIMITED </strong> and agrees to
            buy that plan, such payment shall not be refunded by{" "}
            <strong>DILLIPAY TECHNOLOGIES LIMITED </strong> under any
            circumstances.
          </Typography>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            mb: 3,
            width: "100%",
            maxWidth: "600px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "120%",
              height: "120%",
              background: "rgba(220, 95, 95, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#dc5f5f", mb: 1, zIndex: 1 }}
          >
            KYC Verification
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.6, zIndex: 1 }}
          >
            <VerifiedUserIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Post receipt of payment,{" "}
            <strong>DILLIPAY TECHNOLOGIES LIMITED </strong> will create a
            User ID only after successful KYC verification. If the KYC is
            unsuccessful, a User ID cannot be created.
          </Typography>
        </Paper>

        <Paper
          elevation={8}
          sx={{
            padding: 4,
            borderRadius: 3,
            mb: 3,
            width: "100%",
            maxWidth: "600px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "120%",
              height: "120%",
              background: "rgba(220, 95, 95, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          />
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#dc5f5f", mb: 1, zIndex: 1 }}
          >
            Refund Process
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ lineHeight: 1.6, zIndex: 1 }}
          >
            <ScheduleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Transactions that fail due to issues directly attributable to{" "}
            <strong>DILLIPAY TECHNOLOGIES LIMITED</strong> will be
            refunded within 3-21 working days. Only the actual transaction
            amount will be refunded, excluding fees.
          </Typography>
        </Paper>
      </Box>

      <Typography variant="body2" sx={{ color: "#666", mt: 4 }}>
        For any queries, please contact our customer care.
      </Typography>
    </Container>
  );
};

export default RefundPolicy;

// import { Box, Container } from "@mui/material";
// import React from "react";

// const RefundPolicy = () => {
//   return (
//     <div>
//       <Container maxWidth="lg" sx={{ mt: 4 }}>
//         <div className="landing-bg_biggpay_font">Refund &amp; Policy</div>
//         <Box
//           style={{
//             width: "60px",
//             height: "10px",
//             backgroundColor: "#dc5f5f",
//           }}
//         ></Box>
//         <div>
//           <div>
//             <div>
//               <p className="landing-bg_para">
//                 Once a User chooses to avail any service plan/offer announced by{" "}
//                 <strong> DILLIPAY TECHNOLOGIES LIMITED S</strong> and agrees to buy that
//                 plan/offer by due payment for that plan/offer to{" "}
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong>, such payment by User shall
//                 not be refunded by <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> under
//                 any circumstances whatsoever. Please note that such act of
//                 buying
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> plan is irreversible
//                 process under the applicable law.
//               </p>

//               <p className="landing-bg_para">
//                 Post receipt of payment from the User for the above-mentioned
//                 plan, <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> shall create User ID
//                 in its system ONLY post successful KYC verification of such
//                 User. If the User is unable to get successful KYC done,{" "}
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> shall not be able to create
//                 User ID of such User. Thus, in order to avail
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> services on its portal,
//                 User has to mandatorily get his successful KYC verification
//                 done.
//               </p>
//               <p className="landing-bg_para">
//                 Post User Id creation, while availing various services on
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> portal, a transactions
//                 which have failed for any reason directly attributable to{" "}
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> and
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> has received corresponding
//                 confirmation from the payment gateway, will be automatically
//                 refunded to User’s bank account within 3-21 working days from
//                 the date of transaction and a confirmation mail will be sent to
//                 User’s email id registered with{" "}
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong>. Please note that only the
//                 actual transaction amount will be refunded excluding payment
//                 gateway charges and all applicable taxes. However, for cases
//                 where User has received a successful completion confirmation but
//                 not received services, User is required to submit a complaint by
//                 sending an e-mail to customer care Email ID given on this
//                 website. <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> shall enquire the
//                 matter after receiving the complaint from the User and based on
//                 the enquiry
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> may refund the payment. In
//                 all cases,
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> liability will be
//                 restricted to providing User a valid refund to the extent of
//                 corresponding payment received by{" "}
//                 <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong> with respect to a
//                 particular transaction. <strong> LINKSTECH SERVICES PRIVATE LIMITED S</strong>{" "}
//                 shall not be responsible for any other claim or consequential
//                 liability arising out of failed services on our system.
//               </p>
//             </div>
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default RefundPolicy;
