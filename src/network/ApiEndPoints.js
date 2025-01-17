// export const BASE_URL = "https://api.impsguru.com/";
// export const BASE_URL = "https://uat.impsguru.com/";
// export const BASE_URL = "https://api.vdeepay.com";
export const BASE_URL = "https://api.dillipay.com";
// export const BASE_URL = "https://api.dillipay.com";
// export const BASE_URL = "http://192.168.1.14/impsguru-php/";
// export const BASE_URL = "https://api.vistarmoney.com";
const ApiEndpoints = {
  COOKIE: "sanctum/csrf-cookie",
  SIGN_IN: "auth/signIn",
  LOGOUT: "auth/logOut",
  GET_FILES: "user/getFile",
  EDIT_SUPER_RATE: "admin/updateSuperRate",
  LOGIN_OTP_VALIDATE: "auth/secureLogin",
  GET_ME_USER: "auth/getUser",
  FORGOT_PASS: "auth/forgetPassword",
  RESET_MPIN: "auth/resetMpinByUsername",
  CHANGE_PASS: "auth/changePassword",
  CHANGE_MPIN: "auth/changeMpin",
  OBTAIN_DOCS: "auth/getDocs",
  GET_RECENT_DATA: "reports/recentHistory",
  GET_USERS: "admin/getUsers",
  PAYOUT_BENES: "admin/payoutBene",
  PAYOUT_BENE_KYC_DOCS: "admin/beneKycDoc",
  GET_USER_BY_USERNAME: "auth/getUserByUsername",
  GET_USER_BY_ID: "admin/getUserById",
  UPDATE_USER: "admin/updateUser",
  RESEND_OTP: "wallet/resendOtp",
  USER_PROFIT: "admin/userProfitability",
  DELETE_USER: "admin/deleteUser",
  API_USERS_CHARGES: "admin/charges",
  ADMIN_PRABHU_CHARGES: "admin/prabhuCharge",
  API_USERS_KEYS: "admin/userKeys",
  BLOCK_UNBLOCK: "admin/blockUnblock",
  GET_TRANSACTIONS: "admin/getTransactions",
  CRED_REQ: "admin/getCrRequests",
  CRED_REQ_APPROVE: "admin/crActions",
  GET_OPERATOR: "admin/getOperators",
  ACTIVE_INACTIVE_OPERATOR: "admin/changeOperatorStatus",
  UPDATE_OPERATOR: "admin/updateOperator",
  ADD_OPERATOR: "admin/addOperator",
  CHANGE_ROUTE_OPERATOR: "admin/changeRoute",
  CHANGE_OPERATOR_PIPE: "admin/changePipe",
  GET_ROUTE: "admin/getRoutes",
  GET_CATEGORIES: "admin/getCategories",
  GET_ACCOUNTS: "admin/getAccounts",
  GET_BANKS: "admin/getBanks",
  GET_UTILITY_SCHEME: "schemes/utilitySchemes",
  GET_SCHEME: "schemes/getScheme",
  CREATE_UTILITY_SCHEME: "schemes/createUtilityScheme",
  CREATE_DMT_SCHEME: "schemes/createDmtScheme",
  CREATE_PAYOUT_SCHEME: "schemes/createPayoutScheme",
  CREATE_AEPS_SCHEME: "schemes/createAepsScheme",
  CREATE_CARD_SCHEME: "schemes/createCardScheme",
  CREATE_BANK_SCHEME: "schemes/createBankScheme",
  UPDATE_UTILITY_SCHEME: "schemes/updateUtilityScheme",
  UPDATE_DMT_SCHEME: "schemes/updateDmtScheme",
  UPDATE_PAYOUT_SCHEME: "schemes/updatePayoutScheme",
  UPDATE_AEPS_SCHEME: "schemes/updateAepsScheme",
  UPDATE_CARD_SCHEME: "schemes/updateCardScheme",
  UPDATE_BANK_SCHEME: "schemes/updateBankScheme",
  GET_DMT_SCHEMA: "schemes/dmtSchemes",
  GET_PAYOUT_SCHEMA: "schemes/payoutSchemes",
  GET_AEPS_SCHEMA: "schemes/aepsSchemes",
  GET_CARD_SCHEMA: "schemes/cardSchemes",
  GET_BANK_SCHEMA: "schemes/bankSchemes",
  ADD_ACCOUNT: "admin/createNewAcc",
  ADD_BANK: "admin/createBank",
  ADD_ACCOUNT_TXN: "admin/addAccTxn",
  DELETE_TXN: "admin/deleteTxn",
  GET_LOGIN_HISTORY: "user/getLoginHistory",
  GET_MASSEGE: "admin/getMessages",
  GET_OUT_MASSEGE: "admin/getOutMessages",
  GET_WEBHOOK: "admin/getWebHooks",
  GET_ACCOUNT_STATEMENT: "admin/getAccStatement",
  GET_BANK_STATEMENT: "admin/getBankStatement",
  ADD_BANK_TXN: "admin/addBankTxn",
  DELETE_BANK_TXN: "admin/deleteBankTxn",
  GET_PENDING_ACCOUNT_TRANSACTION: "admin/getPendingBankTxn",
  GET_STATUS: "admin/checkTxnStatus",
  CHANGE_STATUS: "admin/changeTxnStatus",
  UPDATE_ACCOUNT: "admin/updateAccounts",
  GET_PLANS: "admin/getPlans",
  BLOCK_UNBLOCK_PLANS: "",
  ADD_PLAN: "admin/createPlan",
  DELETE_PLAN: "admin/deletePlan",
  COMPLAINTS: "admin/getIssues",
  GET_USER_AD_ASM: "admin/getUserAdAsm",
  GET_NOTIFICATION: "admin/getNotifications",
  GET_NEWS: "admin/news",
  MARK_READ_NOTI: "admin/updateNotification",
  ADMIN_OP_SERVICE: "admin/service",
  VERIFY_PAN: "admin/verifyPan",
  ADMIN_PG_ORDERS: "admin/pgOrders",
  VERIFY_AADHAAR: "admin/verifyAadhaar",
  VERIFY_PIC: "admin/approveRejectKyc",
  TWOFA_AUTH: "auth/twoFactorAuthentication",
  WALLET_DEBIT: "/admin/walletDebit",
  CREATE_VA: "admin/createVa",
  VIRTUAL_ACCS: "admin/virtualAccounts",
  VIRTUAL_TRANSACTIONS: "admin/vaTransactions",
  GET_BLOCKED_AC: "admin/blockedAccounts",
  BANK_DETAILS: "admin/bankDepData",
  SEND_OTP: "user/sendOtp",
  SEND_OTP_Okyc: "user/sendOtpOkyc",
  VERIFY_OTP_OKYC: "user/verifyOtpOkyc",
  GET_API_TOKEN: "user/getApiToken",
  GET_API_KEY: "user/getApiKey",
  RESET_API_TOKEN: "user/resetApiToken",
  RESET_API_KEY: "user/resetApiKey",
  UPDATE_BANK: "admin/updateBank",
  // wallet
  GET_BANK_CREDIT_REQ: "wallet/getBanksForCrRequest",
  CREDIT_REQ: "wallet/createCrRequest",
  MONEY_TRANSFER: "wallet/w1ToW1Transfer",
  DMT_RATE_CHANGE: "wallet/editRetByAd",
  W2TOW1_TRANSFER: "wallet/w2ToW1Transfer",
  GET_PARENT: "user/getParent",
  GET_NUMBER_INFO: "prepaid/getNumberInfo",
  PREPAID_RECHARGE: "prepaid/prepaidRecharge",

  GET_TXN_ID_CR_REQUEST: "user/getTxnIdCrRequest",
  // dmr
  DMR_SETTLEMENTS: "/dmr/settlementBene",
  CHANGE_NAME_OTP: "dmr/updateRemitter",
  CHANGE_NAME: "dmr/validateRemitter",
  GET_REMMITTER_STATUS: "dmr/getRemitterStatus",
  GET_REMMITTER_STATUS_NEW: "dmr/getRemitterStatusNew", // fast response
  NEW_GET_REMMITTER_STATUS: "dmr/remitterStatusExpress",
  GET_REMMITTER_STATUS_SUPER: "dmr/remitterStatusSuper",
  ADD_REM_SUPER: "dmr/registerSupRemitter",
  DMT2_REM_STAT: "dmr/getRemitterStatusDmt2",
  REF_REMMITTER_STATUS: "dmr/refreshRemitterStatus",
  REF_REMMITTER_STATUS1: "dmr/getRemitterStatusNew", //late response
  REMOVE_BENE: "dmr/removeBeneficiary",
  DMT2_REM_BENE: "dmr/removeBeneficiaryDmt2",
  BENE_KYC: "dmr/beneKyc",
  OTP_EXP: "dmr/otpExp",
  VALIDATE_OTP: "dmr/validateRemitter",
  NEW_VALIDATE_OTP: "dmr/verifyExpRemitter",
  VERIFY_REM_UPI: "dmr/verifyRemitterUpi",
  EKYC_INITIATE: "dmr/initiateEkyc",
  GET_REMMITTER_STATUS_ACC: "dmr/getRemitterStatusByAcc",
  GET_BANK_DMR: "dmr/getBanks",
  // DMT2_BANK_LIST: "dmr/getBanksDmt2",
  DMT2_BANK_LIST: "dmr/getLiveBanksDmt2",
  ADD_BENE: "dmr/registerBeneficiary",
  DMT2_ADD_BENE: "dmr/registerBeneficiaryDmt2",
  ADD_REM: "dmr/registerRemitter",
  NEW_ADD_REM: "dmr/registerExpRemitter",
  DMT2_ADD_REM: "dmr/registerRemitterDmt2",
  ADD_BENE_EXPRESS: "dmr/addBenExpress",
  REMOVE_BENE_EXPRESS: "dmr/delBenExpress",

  ADD_REM_EXPRESS: "dmr/registerExpRemitter",
  ADD_REM_SUPER: "dmr/registerSupRemitter",
  GET_REMITTER_STATUS_UPI: "dmr/remitterStatusUpi",
  REMOVE_BENE_UPI: "dmr/deleteBenUpi",
  ADD_REM_UPI: "dmr/registerRemitterUpi",
  ADD_BENE_UPI: "dmr/addBenUpi",
  EXP_TRANSFER: "dmr/expressTxn",
  SUPER_TRANSFER: "dmr/superTransfer",
  DMR_MONEY_TRANSFER: "dmr/transactionDmr",
  VERIFY_ACC: "dmr/accountVerification",
  DMT2_MT: "dmr/transactionDmrDmt2",

  BBPS_CATEGORIES: "prepaid/getCategories",
  BBPS_GET_BILLERS: "prepaid/getBillers",
  BBPS_GET_BILLERS_DETAILS: "prepaid/getBillerDetails",
  BBPS_FETCH_BILL: "prepaid/fetchBillInst",
  BBPS_PAY_BILL: "prepaid/payBillInst",

  //recharges and bill payment
  RECH_FETCH_BILL: "prepaid/fetchBill",
  RECH_PAY_BILL: "prepaid/payBill",

  // user
  GET_ROLL: "",
  RAISE_ISSUE_USER: "user/raiseIssue",
  UPLOAD_USER_PHOTO: "user/uploadProfileImg",
  UPLOAD_USER_KYC: "user/uploadKycImg",
  UPDATE_USER_PROFILE: "user/updateProfile",
  ADD_SETTLEMENT_ACC: "/user/addSettlementAcc",
  GET_SETTLEMENT_ACCS: "/user/getSettlementAcc",
  GET_VIRTUAL_ACC: "user/getVa",
  //
  HANDLE_ISSUE: "admin/updateIssue",
  BANK_SETTELMENT: "dmr/accSettlementNew", ///
  VERIFY_ACC_UPI: "dmr/vpaVerification",
  UPI_PAY: "dmr/upiPay",
  BILLPAY_CC: "dmr/billPaymentCc",
  OLD_TRANSACTIONS: "admin/getOldTransactions",
  // aeps
  AEPS_BANK: "aeps/getBanks",
  AEPS_CASHWITHDRAWAL: "aeps/cashWithdrawl",
  AEPS_APAY: "aeps/aadhaarPay",
  AEPS_BALANCE: "aeps/balanceInquiry",
  AEPS_STATEMENT: "aeps/miniStatement",
  AEPS_INITIATE: "aeps/initiateSignup",
  AEPS_VALIDATE: "aeps/validateSignup",
  AEPS_OUTLET_STATUS: "aeps/outletLoginStatus",
  AEPS_OUTLET_LOGIN: "aeps/outletLogin",

  DMR_WALLET_TRANSFER: "dmr/walletTransfer",
  DELETE_NOTIFICATION: "admin/deleteNotification",
  CHANGE_USERNAME_OTP: "",
  CHANGE_USERNAME: "",
  GET_BOOKS: "books/getBooks",
  ADD_BOOKS: "books/addBook",
  KHATA_BOOKS_STATEMENT: "books/getBookTransaction",
  ADD_BOOKS_STATEMENT: "books/addBookTransaction",

  // REG user
  USER_REG: "wallet/userRegistration",
  USER_PERSONALINFO: "wallet/addPersonalInfo",
  USER_BUSINESSINFO: "wallet/addBusinessInfo",
  GET_DISTRICTS: "prepaid/getDistricts",
  GET_STATES: "getStates",
  GET_HANDLER_DETAILS: "auth/getUserByUsername",
  VERIFY_MOBILE: "auth/verifyMobile",
  SIGN_UP_LAST: "aeps/initiateSignup",
  GET_USERROLES: "onboarding/userOnboarding",

  // Admin employees
  EMPLOYEES: "/emp/impsguru/employee",
  //Admin Dashboard
  ADMIN_DASHBOARD_GET_BANK_BALANCE: "reports/getBankBalance",
  ADMIN_DASHBOARD_GET_API_BALANCE: "admin/apiBalances",
  ADMIN_DASHBOARD_GET_WALLET_BALANCE: "reports/getFloat",
  ADMIN_DASHBOARD_GET_PRIMARY_BALANCE: "reports/getPrimaryData",
  ADMIN_DASHBOARD_GET_TERTIARY_BALANCE: "reports/getTertiaryData",
  ADMIN_DASHBOARD_GET_GRAPH_DATA: "reports/getGraphData",
  ADMIN_DASHBOARD_GET_TXN_DATA: "reports/transactionCount",
  ADMIN_DASHBOARD_GET_USER_DATA: "admin/getUserCount",
  ASM_PRODUCTION_SALE_DATA: "reports/asmReportAll",
  GET_RET_PROD_SALE: "reports/getTertiaryDataServiceWise",
  ADMIN_NOTIFICATION: "admin/createNotification",
  ACCOUNT_BALANCE: "admin/accBalance",
  AGEMENT_DATE: "admin/aggreementDate",
  DASHBOARD_ASM_REPORT: "reports/getTertiaryDataServiceWise",
  MY_EARNINGS: "reports/myEarnings",
  GET_TRIPLE_BARCHART_DATA: "reports/getTertiaryDataServiceWise",
  GET_ASM_TRIPLE_BARCHART_DATA: "reports/asmReportAll",

  //admin acc
  ADMIN_ACC_GET_USER: "reports/getUsersForAcc",
  ADMIN_ACC_GET_TXN: "reports/getTransactionsForAcc",
  ADMIN_ACC_GET_LEADGER: "reports/getLedgerForAcc",
  ADMIN_ACC_GET_BANK_TXN: "reports/getBanktransactionForAcc",
  ADMIN_ACC_GET_ACC_USER: "reports/getAccUsersForAcc",
  GET_COUNT: "admin/getCount",
  ADMIN_ACCOUNTS_LIMITS: "admin/accountLimit",
  // nepal
  PRABHU_KYC: "nepalTransfer/initiateEKycPrabhu",
  MACHINE_KYC: "nepalTransfer/eKycenrollment",
  NEPAL_CUSTOMER_STATUS: "nepalTransfer/getCustomerByMobileOrId",
  NEPAL_OTP: "nepalTransfer/sendOtp",
  NEPAL_STATE_DIS: "nepalTransfer/getStateDistrict",
  NEPAL_STATIC_DATA: "nepalTransfer/getStaticData",
  NEPAL_CREATE_CUSTOMER: "nepalTransfer/createCustomer",
  NEPAL_CREATE_RECEIVER: "nepalTransfer/CreateReceiver",
  NEPAL_BANK_BRANCH: "nepalTransfer/AcPayBankBranchList",
  NEPAL_VALIDATE_RECEIVER: "nepalTransfer/ValidateBankAccount",
  NEPAL_CUSTOMER_ONBOARD: "nepalTransfer/customerOnboarding",
  NEPAL_SEND_TRANSACTION: "nepalTransfer/sendTransaction",
  NEPAL_TRANSACTION: "nepalTransfer/SearchTransaction",
  NEPAL_UVTRANSACTION: "nepalTransfer/UnverifiedTransactions",
  NEPAL_UVCUSTOMERS: "nepalTransfer/UnverifiedCustomers",
  NEPAL_COMPLIANCE_TRANSACTION: "nepalTransfer/ComplianceTransactions",
  GET_SERVICE_CHARGE: "nepalTransfer/GetServiceChargeByCollection",

  ADMIN_SERVICES: "admin/updateServices",
  USER_SERVICES: "admin/getUserServices",

  GET_SIGNUP_ROLES: "onboarding/userOnboarding",
  // flight
  GETAIRPORTS: "flights/getAirports",
  GET_CALENDAR_FARE: "flights/GetCalendarFareByMonth",
  SEARCH_FLIGHTS: "flights/searchFlight",
  PRICE_CHECK_FLIGHTS: "flights/priceCheck",
  BOOK_FLIGHT: "flights/flightBooking",
  CREATE_ORDER_CMS: "user/createOrderCms",
  // pg api
  CREATE_ORDER: "user/createOrderPg",
  // IRCTC AUTH
  IRCTC_AUTH_PAYMENT: "prod/irctc/authPayment",
  UAT_IRCTC_AUTH_PAYMENT: "uat/irctc/authPayment",
  // aeps2 api
  AEPS2_OUTLETREG: "aeps/merchantOnboardingFp",
  AEPS2_MERCHANTEKYC: "aeps/merchantEkycFp",
  AEPS2_VALIDATEOTP: "aeps/validateOtpFp",
  AEPS2_BIOMETRICKYC: "aeps/merchantBiomatricKyc",
  AEPS2_OUTLET_LOGIN: "aeps/twoFaFp",
  AEPS2_CASHWITHDRAWAL: "aeps/cashWithdrawlFp",
  AEPS2_AADHAARPAY: "aeps/aadhaarPayFp",
  AEPS2_BALANCE: "aeps/balanceInquiryFp",
  AEPS2_STATEMENT: "aeps/miniStatementFp",
  AEPS2_STATES: "aeps/getStatesFp",
  AEPS2_BANKS: "aeps/getBanksFp",
  REMITTER_KYC: "dmr/remitterKyc",
  REMITTER_KYC_dmt2: "dmr/remitterEkycDmt2",
  DMT2_REGISTER_REM: "dmr/registerRemitterDmt2",
  // DMT2_MT: "dmr/transactionDmrDmt2",
  OTP_PSPRINT: "dmr/otpForDmt2",
  DMR_MONEY_TRANSFER: "dmr/transactionDmr",
  REGISTER_REMITTER_DMT3: "dmr/registerRemitterDmt3",
  DMT3_ADD_REM: "dmr/remitterEkycDmt3",
  GET_REMMITTER_STATUS_DMT3: "dmr/getRemitterStatusDmt3",
  VALIDATE_SUP_OTP: "dmr/verifySupRemitter",
  OTP_dmt1: "dmr/transactionOtpDmt1",
};
export default ApiEndpoints;
