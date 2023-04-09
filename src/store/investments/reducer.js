import {
  SUBMIT_INVESTMENT,
  SUBMIT_INVESTMENT_SUCCESS,
  INVESTMENTS_API_ERROR,
  LOAD_INVESTMENTS,
  LOAD_INVESTMENTS_SUCCESS,
  UPDATE_INVESTMENT,
  UPDATE_INVESTMENT_SUCCESS,
} from "./actionTypes";

const initialState = {
  investments: [],
  error: "",
  loading: false,
};

const investments = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_INVESTMENT:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_INVESTMENT_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case LOAD_INVESTMENTS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_INVESTMENTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        investments: action.payload.data,
      };
      break;

    case UPDATE_INVESTMENT:
      state = {
        ...state,
        loading: true,
      };
      break;
    case UPDATE_INVESTMENT_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case INVESTMENTS_API_ERROR:
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

export default investments;
