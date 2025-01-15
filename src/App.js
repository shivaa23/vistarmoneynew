/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import SignUp from "./View/SignUp";
import AuthContext from "./store/AuthContext";
import Dashboard from "./View/Dashboard";
import AdimUserView from "./View/AdimUserView";
import SideNav from "./component/SideNav";
import TransactionsView from "./View/AdminTransactionsView";
import CreditRequestView from "./View/AdminCreditRequestView";
import AdminAccountsView from "./View/AdminAccountsView";
import AdminBanksView from "./View/AdminBanksView";
import AdminAccountStatementView from "./View/AdminAccountStatementView";
import AdminBankStatementView from "./View/AdminBankStatementView";
import AdminOperatorView from "./View/AdminOperatorView";
import AdminRoutesView from "./View/AdminRoutesView";
import AdminPlanView from "./View/AdminPlanView";
import AdminMessageView from "./View/AdminMessageView";
import AdSaleView from "./View/AdSaleView";
import MyPurchaseView from "./View/MyPurchaseView";
import MyLedgerView from "./View/MyLedgerView";
import RechargeAndBillPay from "./View/RechargeAndBillPay";
import MoneyTransferView from "./View/MoneyTransferView";
import ExpressMoneyTransfer from "./View/ExpressMoneyTransfer";
import UPITransferView from "./View/UPITransferView";
import BBPSView from "./View/BBPSView";
import AEPS2View from "./View/aeps/AEPS2View";
import ComplaintsView from "./View/ComplaintsView";
import RetMyComplaints from "./View/RetMyComplaints";
import LoginPage from "./View/LoginPage";

import LandingPage from "./View/LandingPage";
import RetDdDashboard from "./View/RetDdDashboard";
import AccountDashboard from "./View/AccountDashboard";
import LandingContactUsPage from "./View/LandingContactUsPage";
import LandingPartnersPage from "./View/LandingPartnersPage";
import LandingAboutUsPage from "./View/LandingAboutUsPage";
import LandingServicesPage from "./View/LandingServicesPage";
import PageNotFound from "./component/PageNotFound";
import PrivacyPolicyView from "./View/PrivacyPolicyView";
import Terms from "./View/Terms";
import MainPage from "./View/MainPage";
import AdminNotificationsView from "./View/AdminNotificationsView";
import NewMyProfile from "./View/NewMyProfile";
import KhataBook from "./View/KhataBook";
import KhataBookStatement from "./View/KhataBookStatement";
import PaymentReceipt from "./component/PaymentReceipt";
import MiniStatementReceipt from "./component/MiniStatementReceipt";
import Unauthorized from "./component/Unauthorized";
import MoneyTransferReceipt from "./component/MoneyTransferReceipt";
import UnauthorizedPage from "./component/UnauthorizedPage";
import SuperMoneyTransfer from "./View/SuperMoneyTransfer";
import BcCerificate from "./View/BcCerificate";
import RefundPolicy from "./View/RefundPolicy";
import NepalTransfer from "./View/NepalTransfer";
import UserAccountLedger from "./View/UserAccountLedger";
import HorizontalSideNav from "./component/HorizontalSideNav";
import RetailerCertificate from "./View/RetailerCertificate";
import TravelContainer from "./View/Travel/TravelContainer";
import FlightBooking from "./View/Travel/FlightBooking";
import PaymentFailed from "./View/PaymentFailed";
import PaymentSuccess from "./View/PaymentSuccess";
import Transactions from "./View/admin/prabhu-transfer/Transactions";

import VendorPayments from "./View/VendorPayments";
import CMSView from "./View/CMSView";
import BookingReviewPage from "./View/Travel/BookingReviewPage";
import RetDdTransactionView from "./View/redDd/RetDdTransactionView";
import AdTransactionView from "./View/Ad/AdTransactionView";
import AsmTransactionView from "./View/asm/AsmTransactionView";
import ApiTransactionView from "./View/api/ApiTransactionView";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";
import AdminRiskView from "./View/AdminRiskView";
import AdminPgOrders from "./View/admin/prabhu-transfer/pg-orders/AdminPgOrders";
import IrctcAuthView from "./View/Irctc/IrctcAuthView";
import AdminEmployeesView from "./View/AdminEmployeesView";
import SettlementsView from "./View/redDd/SettlementsView";
import UATIrctcAuthView from "./View/Irctc/UATIrctcAuthView";
import AdminVirtualAccounts from "./View/AdminVirtualAccounts";
import LoginPageCopy from "./View/LoginPageCopy";
import ApiInvoice from "./View/ApiInvoice";
import AdminBanking from "./View/AdminBanking";
import AdminServices from "./View/AdminServices";
import AdminApiServices from "./View/AdminApiServices";
import Documents from "./View/Documents";
import ProfilePage from "./component/Profile";
import RetAdDdDashboard from "./View/RetAdDdDashboard";
import LoginHistory from "./View/LoginHistory";
import IndemnityLetter from "./component/IndemnityLetter";
import RetailerAgreement from "./View/RetailerAgreement";
import DistributorAgreement from "./View/DistributorAgreement";
import AdminSchema from "./View/AdminSchema";
import AdminAgreement from "./View/AdminAgreement";
import AdminDistributorAgreement from "./View/AdminDistributorAgreement";
import SendMoneyModal from "./modals/SendMoneyModal";
import AccountLedger from "./View/AccountLedger";
import RetQrModal from "./component/RetQrModal";
import Transfer from "./component/TransferW2ToW1";
import BankTransfer from "./component/SideBankTransfer";
import SideBankTransfer from "./component/SideBankTransfer";
import TransferW2ToW1 from "./component/TransferW2ToW1";
import SendMoneyCopy from "./modals/SendMoneyCopy";
import UnclaimedEntries from "./component/UnclaimedEntries";
// import UtilityReceipt from "./component/UtilityReciept";
import BankList from "./View/BankList";
import { UtilityReceipt } from "./component/UtilityReciept";
// import IRCTCView from "./View/Travel/IRCTCView";
// import MainTravelContainer from "./View/Travel/MainTravelContainer";

function App() {
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user;
  const isLoggedIn = authCtx.isLoggedIn;
  // useEffect(() => {
  //   if (user && user.role !== "Admin") {
  //     // console.log("here in user exists");
  //     Crisp.configure(process.env.REACT_APP_CRISP_WEB_KEY, { autoload: false });
  //     Crisp.setTokenId(user?.username ?? "");
  //     Crisp.user.setEmail(user?.email ?? "");
  //     Crisp.user.setNickname(user?.name ?? "");
  //     Crisp.load();
  //   } else {
  //     Crisp.configure(process.env.REACT_APP_CRISP_WEB_KEY, { autoload: false });
  //     Crisp.chat.hide();
  //   }
  // }, [user, isLoggedIn]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login-copy" element={<LoginPageCopy />} />
          <Route path="/UtilityReciept" element={<UtilityReceipt />} />

          <Route
            path="irctc/payment-authentication"
            element={<IrctcAuthView />}
          />
          <Route
            path="uat/irctc/payment-authentication"
            element={<UATIrctcAuthView />}
          />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="" element={<MainPage />}>
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route path="our-services" element={<LandingServicesPage />} />
            <Route path="about-us" element={<LandingAboutUsPage />} />
            <Route path="our-partners" element={<LandingPartnersPage />} />
            <Route path="contact-us" element={<LandingContactUsPage />} />
          </Route>
          <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
          {/*end*/}
          <Route path="/terms-conditions" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/receipt" element={<PaymentReceipt />} />
          <Route path="/indemnityLetter" element={<IndemnityLetter />} />
          <Route path="/service" element={<RetailerAgreement />} />
          <Route path="/admin_service" element={<AdminAgreement />} />
          <Route
            path="/distributoragreement"
            element={<DistributorAgreement />}
          />
          <Route
            path="/admin_distributoragreement"
            element={<AdminDistributorAgreement />}
          />
          <Route path="/mt-receipt" element={<MoneyTransferReceipt />} />
          <Route path="/bank-statement" element={<MiniStatementReceipt />} />
          {/* unauthorized is un-used for now */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="pgSuccess" element={<PaymentSuccess />} />
          <Route path="pgFailed" element={<PaymentFailed />} />

          {isLoggedIn && (
            <Route>
              {(authCtx?.user?.role === "Ret" ||
                authCtx?.user?.role === "Dd") && (
                <Route path="bc-certificate" element={<BcCerificate />} />
              )}
              {(authCtx?.user?.role === "Ret" ||
                authCtx?.user?.role === "Dd" ||
                authCtx?.user?.role === "Ad") && (
                <Route
                  path="retailer-certificate"
                  element={<RetailerCertificate />}
                />
              )}
              <Route path="loginHistory" element={<LoginHistory />} />

              {/* admin Login routes */}
              {authCtx.user && authCtx.user.role === "Admin" && (
                <Route path="admin" element={<SideNav />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  {/* <Route path="my-profile" element={<MyProfile />} /> */}
                  <Route path="my-profile" element={<NewMyProfile />} />
                  <Route path="users" element={<AdimUserView />} />
                  <Route path="transactions" element={<TransactionsView />} />
                  <Route path="prabhu" element={<Transactions />} />
                  <Route path="accounts" element={<AdminAccountsView />} />
                  <Route path="risk" element={<AdminRiskView />} />
                  <Route path="myprofile" element={<NewMyProfile />} />

                  <Route
                    path="virtual-accounts"
                    element={<AdminVirtualAccounts />}
                  />
                  <Route path="account-ledger" element={<AccountLedger />} />

                  <Route path="banks" element={<AdminBanksView />} />
                  <Route path="banking" element={<AdminBanking />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="APiServices" element={<AdminApiServices />} />
                  <Route path="messages" element={<AdminMessageView />} />
                  <Route path="invoice" element={<ApiInvoice />} />
                  <Route
                    path="notification"
                    element={<AdminNotificationsView />}
                  />
                  <Route path="cred-req" element={<CreditRequestView />} />
                  <Route
                    path="accountStatement"
                    element={<AdminAccountStatementView />}
                  />
                  <Route
                    path="bankStatement"
                    element={<AdminBankStatementView />}
                  />
                  <Route path="operators" element={<AdminOperatorView />} />
                  <Route path="routes" element={<AdminRoutesView />} />
                  <Route path="plans" element={<AdminPlanView />} />
                  <Route path="complaints" element={<ComplaintsView />} />
                  <Route path="pg-orders" element={<AdminPgOrders />} />
                  <Route path="employees" element={<AdminEmployeesView />} />
                  <Route path="loginHistory" element={<LoginHistory />} />
                  <Route path="scheme" element={<AdminSchema />} />
                </Route>
              )}

              {/* asm login Routes */}
              {authCtx.user &&
                (authCtx.user.role === "Asm" ||
                  authCtx.user.role === "Zsm") && (
                  <Route
                    path={authCtx?.user?.role === "Asm" ? "asm" : "zsm"}
                    element={<SideNav />}
                  >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<AdimUserView />} />
                    <Route path="cred-req" element={<CreditRequestView />} />
                    <Route
                      path="transactions"
                      element={<AsmTransactionView />}
                    />
                    <Route path="myprofile" element={<NewMyProfile />} />

                    <Route path="my-profile" element={<NewMyProfile />} />
                    <Route path="loginHistory" element={<LoginHistory />} />
                    <Route path="bank-list" element={<BankList />} />
                  </Route>
                )}
              {authCtx.user && authCtx.user.role === "Api" && (
                <Route path="api-user" element={<SideNav />}>
                  <Route path="dashboard" element={<RetDdDashboard />} />
                  <Route path="transactions" element={<ApiTransactionView />} />
                  {/* <Route path="cred-req" element={<CreditRequestView />} /> */}
                  <Route path="invoice" element={<ApiInvoice />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="my-profile" element={<NewMyProfile />} />
                  <Route path="loginHistory" element={<LoginHistory />} />
                  <Route path="myprofile" element={<NewMyProfile />} />

                </Route>
              )}
              {authCtx.user &&
                (authCtx.user.role === "Ad" || authCtx.user.role === "Md") && (
                  <Route
                    path={authCtx?.user?.role === "Ad" ? "ad" : "md"}
                    element={<SideNav />}
                  >
                    <Route path="dashboard" element={<RetAdDdDashboard />} />
                    <Route path="users" element={<AdimUserView />} />
                    <Route
                      path="transactions"
                      element={<AdTransactionView />}
                    />
                    <Route path="cred-req" element={<CreditRequestView />} />
                    <Route path="sale" element={<AdSaleView />} />
                    <Route path="purchase" element={<MyPurchaseView />} />
                    <Route path="ledger" element={<MyLedgerView />} />
                    <Route path="my-profile" element={<NewMyProfile />} />
                    <Route path="khata-book" element={<KhataBook />} />
                    <Route
                      path="khata-statement"
                      element={<KhataBookStatement />}
                    />
                    <Route path="account-ledger" element={<AccountLedger />} />
                    <Route path="bank-list" element={<BankList />} />
                    <Route path="loginHistory" element={<LoginHistory />} />
                    <Route path="myprofile" element={<NewMyProfile />} />

                    <Route
                      path="unclaimedEntries"
                      element={<UnclaimedEntries />}
                    />
                  </Route>
                )}
              {authCtx.user &&
                (authCtx.user.role === "Ret" || authCtx.user.role === "Dd") &&
                authCtx.user.status === 1 && (
                  <Route path="customer" element={<SideNav />}>
                    {authCtx?.user?.layout * 1 === 2 && (
                      <Route path="services" element={<HorizontalSideNav />} />
                    )}
                    <Route path="dashboard" element={<RetDdDashboard />} />
                    <Route path="recharge" element={<RechargeAndBillPay />} />
                    <Route path="account-ledger" element={<AccountLedger />} />
                    <Route path="bank-list" element={<BankList />} />
                    <Route path="Profile-new" element={<ProfilePage />} />
                    <Route path="myprofile" element={<NewMyProfile />} />

                    <Route
                      path="money-transfer"
                      element={<MoneyTransferView />}
                    />
                    <Route path="travel" element={<TravelContainer />} />
                    {/* <Route path="travel-irctc" element={<IRCTCView />} /> */}

                    <Route path="flights-list" element={<FlightBooking />} />
                    <Route
                      path="booking-review"
                      element={<BookingReviewPage />}
                    />
                    <Route path="loginHistory" element={<LoginHistory />} />
                    <Route path="sendmoney" element={<SendMoneyCopy />} />
                    <Route path="qrCode" element={<RetQrModal />} />
                    <Route path="w2tow1" element={<TransferW2ToW1 />} />
                    <Route path="banktransfer" element={<SideBankTransfer />} />

                    <Route
                      path="express-transfer"
                      element={
                        authCtx?.user?.dmt4 === 1 ? (
                          <ExpressMoneyTransfer />
                        ) : (
                          <Unauthorized />
                        )
                      }
                    />
                    {authCtx?.user?.st === 1 && (
                      <Route
                        path="super-transfer"
                        element={<SuperMoneyTransfer />}
                      />
                    )}

                    <Route
                      path="vendor-payments"
                      element={<VendorPayments />}
                    />

                    {authCtx?.user?.stm === 1 && (
                      <Route path="settlements" element={<SettlementsView />} />
                    )}
                    <Route path="cms" element={<CMSView />} />

                    {authCtx?.user?.nepal_transfer === 1 && (
                      <Route
                        path="nepal-transfer"
                        element={<NepalTransfer />}
                      />
                    )}
                    {authCtx?.user?.nepal_transfer === 1 && (
                      <Route
                        path="nepal-transfer/ekyc"
                        element={<NepalTransfer />}
                      />
                    )}

                    <Route
                      path="upi-transfer"
                      element={
                        authCtx?.user?.upi_transfer === 1 ? (
                          <UPITransferView />
                        ) : (
                          <Unauthorized />
                        )
                      }
                    />
                    <Route
                      path="bbps"
                      element={
                        authCtx?.user?.bbps === 1 ? (
                          <BBPSView />
                        ) : (
                          <Unauthorized />
                        )
                      }
                    />
                    {/* <Route
                      path="aeps"
                      element={
                        authCtx?.user?.aeps === 1 ? (
                          <AEPS2View />
                        ) : (
                          <Unauthorized />
                        )
                      }
                    /> */}
                    <Route path="aeps" element={<AEPS2View />} />
                    <Route
                      path="transactions"
                      element={<RetDdTransactionView />}
                    />
                    {authCtx?.user?.acst === 1 && (
                      <Route
                        path="account-ledger"
                        element={<UserAccountLedger />}
                      />
                    )}
                    <Route path="cred-req" element={<CreditRequestView />} />
                    <Route path="complaints" element={<RetMyComplaints />} />
                    <Route path="purchase" element={<MyPurchaseView />} />
                    <Route path="my-profile" element={<NewMyProfile />} />
                    <Route path="khata-book" element={<KhataBook />} />
                    <Route
                      path="khata-statement"
                      element={<KhataBookStatement />}
                    />
                  </Route>
                )}

              {authCtx.user && authCtx.user.role === "Acc" && (
                <Route path="account" element={<SideNav />}>
                  <Route path="dashboard" element={<AccountDashboard />} />{" "}
                </Route>
              )}
              {/* {authCtx.user && authCtx.user.role !== "Admin" && (
                  <Route path="other" element={<SideNav />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="my-profile" element={<MyProfile />} />
                  </Route>
                )} */}
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;

// "/user/:userId" to pass id
