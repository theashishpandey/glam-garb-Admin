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

const initialState = {
  adduser: [],
  error: "",
  loading: false,
};

const adduser = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_ADDUSER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_ADDUSER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "User added successfully.",
        message_type: "Success",
      };
      break;

    case UPDATE_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case UPDATE_USER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "User updated successfully.",
        message_type: "Success",
      };
      break;

    case ACTIVATE_DEACTIVATE_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case ACTIVATE_DEACTIVATE_USER_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case LOAD_ADDUSER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ADDUSER_SUCCESS:
      state = {
        ...state,
        loading: false,
        adduser: action.payload.data,
      };
      break;

    case LOAD_GETBYROLE:
      state = {
        ...state,
        loading: true,
      };
      break;

    case LOAD_GETBYROLE_SUCCESS:
      state = {
        ...state,
        loading: false,
        reporting_officers: action.payload.data,
      };
      break;

    case ADDUSER_API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
        message: action.payload,
        message_type: "Error",
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default adduser;
