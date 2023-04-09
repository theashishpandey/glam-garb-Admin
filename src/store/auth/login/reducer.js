import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  userRoutes: null,
  store_warehouse_details: undefined,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        error: null,
        store_warehouse_details: action.payload.data.store_warehouse_details,
        user_for: action.payload.data.user_for,
        role: action.payload.data.role,
        token: action.payload.data.token,
        userRoutes: action.payload.routes,
      };
      break;
    case LOGOUT_USER:
      state = { ...state };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, error: null };
      break;
    case CHANGE_PASSWORD:
      state = { ...state };
      break;
    case CHANGE_PASSWORD_SUCCESS:
      state = { ...state };
      break;
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
