import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiErrorToast, okSuccessToast } from "../../utils/ToastUtil";

import {
  addEmployeeThunk,
  updateApiUserChargesThunk,
  updateApiUserKeysThunk,
  updateEmployeeThunk,
} from "./allUsersThunk";

const initialApiUserCharges = {
  AIR: "",
  VOD: "",
  JIO: "",
  MTT: "",
  BST: "",
  ADG: "",
  DSH: "",
  D2H: "",
  TSK: "",
  SUN: "",
  ACV: "",
  DMT: "",
  DMT2: "",
  CCB: "",
  WTR: "",
  aeps1: "",
  aeps2: "",
  payout1: "",
  payout2: "",
  payout3: "",
  payout4: "",
};
const initialEmployeesState = {
  name: "",
  dob: "",
  role: "",
  basic_pay: "",
  hra: "",
  ta: "",
  bank: "",
  ifsc: "",
  acc_number: "",
  target: "",
  joining_date: "",
};

const initialState = {
  apiUserChargesLoading: false,
  apiUserCharges: initialApiUserCharges,
  apiUserKeys: {
    ip: "",
    hkey: "",
  },
  employees: initialEmployeesState,
  employeesLoading: false,
};

export const updateApiUserCharges = createAsyncThunk(
  "admin/updateApiUserCharges",
  updateApiUserChargesThunk
);
export const updateApiUserKeys = createAsyncThunk(
  "admin/updateApiUserKeys",
  updateApiUserKeysThunk
);
export const addEmployee = createAsyncThunk(
  "admin/addEmployee",
  addEmployeeThunk
);
export const updateEmployee = createAsyncThunk(
  "admin/updateEmployee",
  updateEmployeeThunk
);

const allUsersSlice = createSlice({
  name: "allUsersSlice",
  initialState,
  reducers: {
    handleChangeApiUsers: (state, { payload }) => {
      const { name, value } = payload;
      state.apiUserCharges[name] = value;
    },
    handleChangeKeys: (state, { payload }) => {
      const { name, value } = payload;
      state.apiUserKeys[name] = value;
    },
    setApiUserCharges: (state, { payload }) => {
      if (payload) {
        Object.keys(payload).forEach((service) => {
          if (service in state.apiUserCharges) {
            return (state.apiUserCharges[service] = payload[service]);
          }
        });
      }
    },
    setApiUserKeys: (state, { payload }) => {
      if (payload) {
        Object.keys(payload).forEach((service) => {
          if (service in state.apiUserKeys) {
            return (state.apiUserKeys[service] = payload[service]);
          }
        });
      }
    },
   

    resetData: (state) => {
      state.apiUserCharges = initialApiUserCharges;
      state.apiUserKeys = { ip: "", hkey: "" };
    },
    // EMPLOYEES REDUCERS
    setEmployeesData: (state, { payload }) => {
      if (payload) {
        Object.keys(payload).forEach((key) => {
          if (key in state.employees) {
            return (state.employees[key] = payload[key]);
          }
        });
      }
    },
    handleChangeEmployees: (state, { payload }) => {
      const { name, value } = payload;
      state.employees[name] = value;
    },
    resetDataEmployees: (state) => {
      state.employees = initialEmployeesState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateApiUserCharges.pending, (state) => {
        state.apiUserChargesLoading = true;
      })
      .addCase(updateApiUserCharges.fulfilled, (state, { payload }) => {

        state.apiUserChargesLoading = false;
      })
      .addCase(updateApiUserCharges.rejected, (state, { payload }) => {
        state.apiUserChargesLoading = false;
        apiErrorToast(payload);
      })
      .addCase(updateApiUserKeys.pending, (state) => {
        state.apiUserChargesLoading = true;
      })
      .addCase(updateApiUserKeys.fulfilled, (state, { payload }) => {
        state.apiUserChargesLoading = false;
      })
      .addCase(updateApiUserKeys.rejected, (state, { payload }) => {
        state.apiUserChargesLoading = false;
        apiErrorToast(payload);
      })
      // ######## EMPLOYEES ########
      .addCase(addEmployee.pending, (state) => {
        state.employeesLoading = true;
      })
      .addCase(addEmployee.fulfilled, (state, { payload }) => {
        const { message } = payload;

        state.employeesLoading = false;
        okSuccessToast(message);
      })
      .addCase(addEmployee.rejected, (state, { payload }) => {
        state.employeesLoading = false;
        apiErrorToast(payload);
      })
      .addCase(updateEmployee.pending, (state) => {
        state.employeesLoading = true;
      })
      .addCase(updateEmployee.fulfilled, (state, { payload }) => {
        const { message } = payload;

        state.employeesLoading = false;
        okSuccessToast(message);
      })
      .addCase(updateEmployee.rejected, (state, { payload }) => {
        state.employeesLoading = false;
        apiErrorToast(payload);
      });
  },
});

export const {
  handleChangeApiUsers,
  setApiUserCharges,
  handleChangeKeys,
  setApiUserKeys,
  resetData,
  // EMPLOYEES
  setEmployeesData,
  handleChangeEmployees,
  resetDataEmployees,
} = allUsersSlice.actions;

export default allUsersSlice.reducer;
