import {
  SUBMIT_INCOME,
  SUBMIT_INCOME_SUCCESS,
  INCOMES_API_ERROR,
  LOAD_INCOMES,
  LOAD_INCOMES_SUCCESS,
} from "./actionTypes";

const initialState = {
  incomes: [],
  error: "",
  loading: false,
};

const incomes = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_INCOME:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_INCOME_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case LOAD_INCOMES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_INCOMES_SUCCESS:
      state = {
        ...state,
        loading: false,
        incomes: action.payload.data,
      };
      break;

    case INCOMES_API_ERROR:
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

export default incomes;
