import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./scss/style.scss";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./store/AuthContext";
import { SideBarContextProvider } from "./store/SideBarContext";
import { store } from "./store";
import { Provider } from "react-redux";
import { CommonContextProvider } from "./store/CommonContext";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const firebaseConfig = {
  apiKey: "AIzaSyAuduEs5a-Fhke-QMPzd151DF1_8ktfMSk",
  authDomain: "paisaonmobile20191204v1.firebaseapp.com",
  databaseURL: "https://paisaonmobile20191204v1.firebaseio.com",
  projectId: "paisaonmobile20191204v1",
  storageBucket: "paisaonmobile20191204v1.appspot.com",
  messagingSenderId: "484483390674",
  appId: "1:484483390674:web:26df0edbe21a5c1196a10b",
  measurementId: "G-N3EXGKPH5P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);
// let persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate persistor={persistor} loading={<Loader loading={true} />}> */}
      <AuthContextProvider>
        <SideBarContextProvider>
          <CommonContextProvider>
            <App />
          </CommonContextProvider>
        </SideBarContextProvider>
      </AuthContextProvider>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
