import ApiEndpoints from "../../network/ApiEndPoints";
import { customFetch } from "../../utils/Apihelper";
import { okSuccessToast } from "../../utils/ToastUtil";
import {
  setApiUserCharges,
  setApiUserKeys,
  // setEmployeesData,
} from "./allUsersSlice";

export const updateApiUserChargesThunk = async (charges, thunkAPI) => {
  const { apiUserCharges, id } = charges;
  try {
    const resp = await customFetch.post(
      ApiEndpoints.API_USERS_CHARGES + "?user_id=" + id,
      apiUserCharges
    );
    thunkAPI.dispatch(setApiUserCharges(resp?.data?.data));
    okSuccessToast("Charges Updated");
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
};

export const updateApiUserKeysThunk = async (keys, thunkAPI) => {
  const { apiUserKeys, id } = keys;
  try {
    const resp = await customFetch.post(
      ApiEndpoints.API_USERS_KEYS + "?user_id=" + id,
      apiUserKeys
    );
    thunkAPI.dispatch(setApiUserKeys(resp?.data?.data));
    okSuccessToast("Keys Updated");
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
};

export const addEmployeeThunk = async (empData, thunkAPI) => {
  try {
    const resp = await customFetch.post(ApiEndpoints.EMPLOYEES, empData);

    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
};
export const updateEmployeeThunk = async (empData, thunkAPI) => {
  try {
    const resp = await customFetch.patch(ApiEndpoints.EMPLOYEES, empData);
    // const { data } = resp.data;
    // thunkAPI.dispatch(setEmployeesData(data));
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response);
  }
};
