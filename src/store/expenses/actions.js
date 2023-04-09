import {
  SUBMIT_EXPENSE,
  SUBMIT_EXPENSE_SUCCESS,
  EXPENSES_API_ERROR,
  LOAD_EXPENSES,
  LOAD_EXPENSES_SUCCESS,
} from "./actionTypes";

export const submitExpense = (expense, history) => {
  return {
    type: SUBMIT_EXPENSE,
    payload: { expense, history },
  };
};

export const submitExpenseSuccess = (expense) => {
  return {
    type: SUBMIT_EXPENSE_SUCCESS,
    payload: expense,
  };
};

export const loadExpenses = () => {
  return {
    type: LOAD_EXPENSES,
    payload: {},
  };
};

export const loadExpensesSuccess = (expenses) => {
  return {
    type: LOAD_EXPENSES_SUCCESS,
    payload: expenses,
  };
};

export const expensesApiError = (error) => {
  return {
    type: EXPENSES_API_ERROR,
    payload: error,
  };
};
