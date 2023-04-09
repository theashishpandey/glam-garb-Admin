import {
  REPORTS_API_ERROR,
  LOAD_SALES,
  LOAD_SALES_SUCCESS,
  LOAD_ACCOUNTS,
  LOAD_ACCOUNTS_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  sales_output: { response: [], responsePie: { total: 0 } },
  accounts_output: {
    total_investment: 0,
    investments: [],
    total_income: 0,
    incomes: [],
    total_sale: 0,
    sales: [],
    total_expense: 0,
    expenses: [],
  },
};

const Reports = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SALES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_SALES_SUCCESS:
      state = {
        ...state,
        loading: false,
        sales_output: action.payload,
      };
      break;
    case LOAD_ACCOUNTS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ACCOUNTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        accounts_output: action.payload,
      };
      break;

    case REPORTS_API_ERROR:
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

export default Reports;
