import {
  SUBMIT_EXPENSE,
  SUBMIT_EXPENSE_SUCCESS,
  EXPENSES_API_ERROR,
  LOAD_EXPENSES,
  LOAD_EXPENSES_SUCCESS,
} from "./actionTypes";

const initialState = {
  expenses: [],
  error: "",
  loading: false,
};

const expenses = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_EXPENSE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_EXPENSE_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case LOAD_EXPENSES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_EXPENSES_SUCCESS:
      state = {
        ...state,
        loading: false,
        expenses: action.payload.data,
      };
      break;

    case EXPENSES_API_ERROR:
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

export default expenses;
