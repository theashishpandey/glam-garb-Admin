import {
  REPORTS_API_ERROR,
  LOAD_SALES,
  LOAD_SALES_SUCCESS,
  LOAD_ACCOUNTS,
  LOAD_ACCOUNTS_SUCCESS,
} from "./actionTypes";

export const loadSales = (sales_input) => {
  return {
    type: LOAD_SALES,
    payload: sales_input,
  };
};

export const loadSalesSuccess = (sales_output) => {
  return {
    type: LOAD_SALES_SUCCESS,
    payload: sales_output,
  };
};

export const loadAccounts = (accounts_input) => {
  return {
    type: LOAD_ACCOUNTS,
    payload: accounts_input,
  };
};

export const loadAccountsSuccess = (accounts_input) => {
  return {
    type: LOAD_ACCOUNTS_SUCCESS,
    payload: accounts_input,
  };
};

export const ReportsApiError = (error) => {
  return {
    type: REPORTS_API_ERROR,
    payload: error,
  };
};
