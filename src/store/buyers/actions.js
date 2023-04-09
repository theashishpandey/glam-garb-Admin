import {
    SUBMIT_BUYERS,
    SUBMIT_BUYERS_SUCCESS,
    UPDATE_BUYERS,
    UPDATE_BUYERS_SUCCESS,
    BUYER_API_ERROR,
    LOAD_BUYERS,
    LOAD_BUYERS_SUCCESS,
  } from "./actionTypes";
  
  export const submitBuyers = (buyers, history) => {
    return {
      type: SUBMIT_BUYERS,
      payload: { buyers, history },
    };
  };
  
  export const submitBuyersSuccess = (buyers) => {
    return {
      type: SUBMIT_BUYERS_SUCCESS,
      payload: buyers,
    };
  };

  export const updateBuyers = (buyers, history) => {
    return {
      type: UPDATE_BUYERS,
      payload: { buyers, history },
    };
  };
  
  export const updateBuyersSuccess = (buyers) => {
    return {
      type: UPDATE_BUYERS_SUCCESS,
      payload: buyers,
    };
  };
  
  export const loadBuyers = () => {
    return {
      type: LOAD_BUYERS,
      payload: {},
    };
  };
  
  export const loadBuyersSuccess = (buyers) => {
    return {
      type: LOAD_BUYERS_SUCCESS,
      payload: buyers,
    };
  };
  
  export const buyerApiError = (error) => {
    return {
      type: BUYER_API_ERROR,
      payload: error,
    };
  };
  