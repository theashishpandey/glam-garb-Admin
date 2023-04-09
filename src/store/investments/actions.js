import {
  SUBMIT_INVESTMENT,
  SUBMIT_INVESTMENT_SUCCESS,
  INVESTMENTS_API_ERROR,
  LOAD_INVESTMENTS,
  LOAD_INVESTMENTS_SUCCESS,
  UPDATE_INVESTMENT,
  UPDATE_INVESTMENT_SUCCESS,
} from "./actionTypes";

export const submitInvestment = (investment, history) => {
  return {
    type: SUBMIT_INVESTMENT,
    payload: { investment, history },
  };
};

export const submitInvestmentSuccess = (investment) => {
  return {
    type: SUBMIT_INVESTMENT_SUCCESS,
    payload: investment,
  };
};

export const loadInvestments = () => {
  return {
    type: LOAD_INVESTMENTS,
    payload: {},
  };
};

export const loadInvestmentsSuccess = (investments) => {
  return {
    type: LOAD_INVESTMENTS_SUCCESS,
    payload: investments,
  };
};

export const updateInvestment = (investment, history) => {
  return {
    type: UPDATE_INVESTMENT,
    payload: { investment, history },
  };
};

export const updateInvestmentSuccess = (investment) => {
  return {
    type: UPDATE_INVESTMENT_SUCCESS,
    payload: investment,
  };
};

export const investmentsApiError = (error) => {
  return {
    type: INVESTMENTS_API_ERROR,
    payload: error,
  };
};
