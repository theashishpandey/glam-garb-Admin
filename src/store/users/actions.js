import {
  SUBMIT_ADDUSER,
  SUBMIT_ADDUSER_SUCCESS,
  ADDUSER_API_ERROR,
  LOAD_ADDUSER,
  LOAD_ADDUSER_SUCCESS,
  LOAD_GETBYROLE,
  LOAD_GETBYROLE_SUCCESS,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  ACTIVATE_DEACTIVATE_USER,
  ACTIVATE_DEACTIVATE_USER_SUCCESS,
} from "./actionTypes";

export const submitAddUser = (adduser, history) => {
  return {
    type: SUBMIT_ADDUSER,
    payload: { adduser, history },
  };
};

export const submitAddUserSuccess = (adduser) => {
  return {
    type: SUBMIT_ADDUSER_SUCCESS,
    payload: adduser,
  };
};

export const updateUser = (user, history) => {
  return {
    type: UPDATE_USER,
    payload: { user, history },
  };
};

export const updateUserSuccess = (user) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: user,
  };
};

export const activate_deactivateUser = (user_status, history) => {
  return {
    type: ACTIVATE_DEACTIVATE_USER,
    payload: { user_status, history },
  };
};

export const activate_deactivateUserSuccess = (user_status) => {
  return {
    type: ACTIVATE_DEACTIVATE_USER_SUCCESS,
    payload: user_status,
  };
};

export const loadAddUser = () => {
  return {
    type: LOAD_ADDUSER,
    payload: {},
  };
};

export const loadAddUserSuccess = (adduser) => {
  return {
    type: LOAD_ADDUSER_SUCCESS,
    payload: adduser,
  };
};

export const adduserApiError = (error) => {
  return {
    type: ADDUSER_API_ERROR,
    payload: error,
  };
};

export const loadgetByRole = (role) => {
  return {
    type: LOAD_GETBYROLE,
    payload: { role },
  };
};

export const loadgetByRoleSuccess = (user) => {
  return {
    type: LOAD_GETBYROLE_SUCCESS,
    payload: user,
  };
};
