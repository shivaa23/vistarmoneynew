// import { m } from "framer-motion"
// import PropTypes from "prop-types"
// import { useContext } from "react"
// import { Box } from "@mui/material"
// // import { useRouter } from "next/router"
// import { AuthContextProvider } from "../../store/AuthContext"
// import { alpha, styled } from "@mui/material/styles"
// import { smLogo } from "../../iconsImports"

// const StyledRoot = styled("div")(() => ({
//   right: 0,
//   bottom: 0,
//   zIndex: 9998,
//   width: "100%",
//   height: "100%",
//   position: "fixed",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   backdropFilter: "blur(5px)",
//   background: "rgb(0, 0, 0,0.2)"
// }))

// const Loader = ({loading, children}) => {

//   return (
//     <div>
//       {loading ? (
//         <StyledRoot>
//           <m.div
//             animate={{
//               scale: [1, 0.9, 0.9, 1, 1],
//               opacity: [1, 0.48, 0.48, 1, 1]
//             }}
//             transition={{
//               duration: 2,
//               ease: "easeInOut",
//               repeatDelay: 1,
//               repeat: Infinity
//             }}
//           >
//             <img
//               src={smLogo}
//               style={{ cursor: "pointer", width: 80 }}
//               alt="favicon"
//             />
//           </m.div>
//           <Box
//             component={m.div}
//             animate={{
//               scale: [1.6, 1, 1, 1.6, 1.6],
//               rotate: [270, 0, 0, 270, 270],
//               opacity: [0.25, 1, 1, 1, 0.25],
//               borderRadius: ["25%", "25%", "50%", "50%", "25%"]
//             }}
//             transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
//             sx={{
//               width: 100,
//               height: 100,
//               position: "absolute",
//               borderRadius: 4,
//               border: "solid 5px #00693E"
//             }}
//           />
//           <Box
//             component={m.div}
//             animate={{
//               scale: [1, 1.2, 1.2, 1, 1],
//               rotate: [0, 270, 270, 0, 0],
//               opacity: [1, 0.25, 0.25, 0.25, 1],
//               borderRadius: ["25%", "25%", "50%", "50%", "25%"]
//             }}
//             transition={{
//               ease: "linear",
//               duration: 3.2,
//               repeat: Infinity
//             }}
//             sx={{
//               zIndex: 9999,
//               width: 120,
//               height: 120,
//               position: "absolute",
//               borderRadius: 4,
//               border: "solid 5px #F18D18"
//             }}
//           />
//         </StyledRoot>
//       ) : null}
//       {children}
//     </div>
//   )
// }
// // Loader.propTypes = {
// //   children: PropTypes.any.isRequired
// // }

// export default Loader

// import { Box } from "@mui/material";
// import { smLogo } from "../../iconsImports"; // Ensure this path is correct

// const Loader = ({ loading, children }) => {
//   return (
//     <div>
//       {loading && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backdropFilter: "blur(5px)",
//             background: "rgba(0, 0, 0, 0.5)", // Darker backdrop for better visibility
//             zIndex: 9998,
//             flexDirection: "column",
//           }}
//         >
//           <div className="loader-container">
//             <img
//               src={smLogo}
//               style={{
//                 cursor: "pointer",
//                 width: 80,
//                 animation: "zoomInOut 1.5s infinite", // Zoom in/out animation for the logo
//               }}
//               alt="Loading..."
//             />
//             <div className="circle1" />
//             <div className="circle2" />
//           </div>
//           <p className="loading-text">Please wait while we are processing your request...</p>
//         </Box>
//       )}
//       {children}
//       <style jsx>{`
//         .loader-container {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .circle1,
//         .circle2 {
//           position: absolute;
//           border-radius: 50%; /* Circular shape */
//           animation: zoomInOut 2.5s infinite; /* Zoom in/out animation for circles */
//         }

//         .circle1 {
//           width: 200px;
//           height: 200px;
//           border: 8px solid #00693E;
//           animation-delay: 0s; /* Starts immediately */
//         }

//         .circle2 {
//           width: 220px;
//           height: 220px;
//           border: 8px solid #F18D18;
//           animation-delay: 0.25s; /* Starts a bit later for a staggered effect */
//           opacity: 0.3;
//         }

//         @keyframes rotateAnimation1 {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes rotateAnimation2 {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(-360deg);
//           }
//         }

//         @keyframes zoomInOut {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.1); /* Zoom in effect */
//           }
//         }

//         .loading-text {
//           margin-top: 5%;
//           font-size: 20px;
//           color: white;
//           font-family: Arial, sans-serif;
//           text-align: center; /* Center the text */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Loader;

// import { Box } from "@mui/material";
// import { smLogo } from "../../iconsImports"; // Ensure this path is correct

// const Loader = ({ loading, children }) => {
//   return (
//     <div>
//       {loading && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backdropFilter: "blur(5px)",
//             background: "rgba(255, 255, 255, 0.8)", // Lighter backdrop
//             zIndex: 9998,
//             flexDirection: "column",
//           }}
//         >
//           <div className="loader-container">
//             <img
//               src={smLogo}
//               style={{
//                 cursor: "pointer",
//                 width: 120, // Increased size
//                 animation: "spin 2s linear infinite", // Spin animation for the logo
//               }}
//               alt="Loading..."
//             />
//             <div className="loader-bar" />
//           </div>
//           <p className="loading-text">Hang tight! We're processing your request.</p>
//         </Box>
//       )}
//       {children}
//       <style jsx>{`
//         .loader-container {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-direction: column;
//         }

//         .loader-bar {
//           width: 100px;
//           height: 6px;
//           background: #00693E;
//           border-radius: 3px; /* Rounded edges */
//           margin-top: 15px; /* Space between logo and bar */
//           animation: loading 1.5s linear infinite; /* Loading animation */
//         }

//         @keyframes loading {
//           0% {
//             transform: scaleX(0);
//           }
//           50% {
//             transform: scaleX(1);
//           }
//           100% {
//             transform: scaleX(0);
//           }
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         .loading-text {
//           margin-top: 20px;
//           font-size: 16px;
//           color: #333;
//           font-family: 'Arial', sans-serif;
//           text-align: center; /* Center the text */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Loader;

import { Box } from "@mui/material";
import { smLogo } from "../../iconsImports"; // Ensure this path is correct

const Loader = ({ loading, children, changeloder }) => {
  return (
    <div>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            background: "rgba(30, 30, 30, 0.85)", // Semi-transparent dark background
            zIndex: 9998,
            flexDirection: "column",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div className="loader-container">
            {/* Conditionally render the image based on the changeloder prop */}
            {!changeloder && (
              <img
                src={smLogo}
                style={{
                  cursor: "pointer",
                  width: 200, // Larger logo
                }}
                alt="Loading..."
              />
            )}
            <div className="loader-bar" />
          </div>
          <p className="loading-text">
            Just a moment! We're preparing your request...
          </p>
        </Box>
      )}
      {children}
      <style jsx>{`
        .loader-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .loader-bar {
          width: 180px;
          height: 6px;
          background: linear-gradient(
            90deg,
            #ff4081,
            #ffeb3b
          ); // Gradient loading bar
          border-radius: 3px; /* Rounded edges */
          margin-top: 20px; /* Space between logo and bar */
          animation: loading 1.5s ease-in-out infinite; /* Loading animation */
        }

        @keyframes loading {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(1);
          }
          100% {
            transform: scaleX(0);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          margin-top: 18px;
          font-size: 18px;
          font-weight: bold;
          color: #ffffff; /* White text */
          animation: fadeIn 1.5s ease-in-out infinite alternate; /* Text fade animation */
        }

        @keyframes fadeIn {
          0% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;




// import { Box } from "@mui/material";
// import { smLogo } from "../../iconsImports"; // Ensure this path is correct

// const Loader = ({ loading, children }) => {
//   return (
//     <div>
//       {loading && (
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             backdropFilter: "blur(5px)",
//             background: "rgba(30, 30, 30, 0.85)", // Semi-transparent dark background
//             zIndex: 9998,
//             flexDirection: "column",
//             color: "#fff",
//             textAlign: "center",
//           }}
//         >
//           <div className="loader">
//             <div className="dot" />
//             <div className="dot" />
//             <div className="dot" />
//           </div>
//           <p className="loading-text">Loading... Please wait.</p>
//         </Box>
//       )}
//       {children}
//       <style jsx>{`
//         /* Loader Container */
//         .loader {
//           width: 200px;
//           height: 200px;
//           perspective: 200px;
//         }

//         /* Dots */
//         .dot {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           width: 120px;
//           height: 120px;
//           margin-top: -60px;
//           margin-left: -60px;
//           border-radius: 100px;
//           border: 40px outset #1e3f57;
//           transform-origin: 50% 50%;
//           transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           background-color: transparent;
//           animation: dot1 1000ms cubic-bezier(.49,.06,.43,.85) infinite;
//         }

//         .dot:nth-child(2) {
//           width: 140px;
//           height: 140px;
//           margin-top: -70px;
//           margin-left: -70px;
//           border-width: 30px;
//           border-color: #447891;
//           animation-name: dot2;
//           animation-delay: 75ms;
//           box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.1);
//           transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//         }

//         .dot:nth-child(3) {
//           width: 160px;
//           height: 160px;
//           margin-top: -80px;
//           margin-left: -80px;
//           border-width: 20px;
//           border-color: #6bb2cd;
//           animation-name: dot3;
//           animation-delay: 150ms;
//           box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.1);
//           transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//         }

//         @keyframes dot1 {
//           0% {
//             border-color: #1e3f57;
//             transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           }
//           50% {
//             border-color: #1e574f;
//             transform: rotateX(20deg) rotateY(20deg) translateZ(0px);
//           }
//           100% {
//             border-color: #1e3f57;
//             transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           }
//         }

//         @keyframes dot2 {
//           0% {
//             border-color: #447891;
//             box-shadow: inset 0 0 15px 0 rgba(255, 255, 255, 0.2);
//             transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           }
//           50% {
//             border-color: #449180;
//             box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.8);
//             transform: rotateX(20deg) rotateY(20deg) translateZ(0px);
//           }
//           100% {
//             border-color: #447891;
//             box-shadow: inset 0 0 15px 0 rgba(255, 255, 255, 0.2);
//             transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           }
//         }

//         @keyframes dot3 {
//           0% {
//             border-color: #6bb2cd;
//             box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.1);
//             transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           }
//           50% {
//             border-color: #6bcdb2;
//             box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.8);
//             transform: rotateX(20deg) rotateY(20deg) translateZ(0px);
//           }
//           100% {
//             border-color: #6bb2cd;
//             box-shadow: inset 0 0 15px 0 rgba(0, 0, 0, 0.1);
//             transform: rotateX(24deg) rotateY(20deg) translateZ(-25px);
//           }
//         }

//         .loading-text {
//           margin-top: 20px;
//           font-size: 18px;
//           color: #ffffff; /* White text */
//           font-weight: 500;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Loader;
