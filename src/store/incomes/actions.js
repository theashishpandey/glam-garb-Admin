import {
  SUBMIT_INCOME,
  SUBMIT_INCOME_SUCCESS,
  INCOMES_API_ERROR,
  LOAD_INCOMES,
  LOAD_INCOMES_SUCCESS,
} from "./actionTypes";

export const submitIncome = (income, history) => {
  return {
    type: SUBMIT_INCOME,
    payload: { income, history },
  };
};

export const submitIncomeSuccess = (income) => {
  return {
    type: SUBMIT_INCOME_SUCCESS,
    payload: income,
  };
};

export const loadIncomes = () => {
  return {
    type: LOAD_INCOMES,
    payload: {},
  };
};

export const loadIncomesSuccess = (incomes) => {
  return {
    type: LOAD_INCOMES_SUCCESS,
    payload: incomes,
  };
};

export const incomesApiError = (error) => {
  return {
    type: INCOMES_API_ERROR,
    payload: error,
  };
};
