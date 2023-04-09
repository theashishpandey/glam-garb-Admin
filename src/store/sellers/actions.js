import {
    SUBMIT_SELLER,
    SUBMIT_SELLER_SUCCESS,
    UPDATE_SELLER,
    UPDATE_SELLER_SUCCESS,
    SELLER_API_ERROR,
    LOAD_SELLERS,
    LOAD_SELLERS_SUCCESS,
  } from "./actionTypes";
  
  export const submitSeller = (seller, history) => {
    return {
      type: SUBMIT_SELLER,
      payload: { seller, history },
    };
  };
  
  export const submitSellerSuccess = (seller) => {
    return {
      type: SUBMIT_SELLER_SUCCESS,
      payload: seller,
    };
  };

  export const updateSeller = (seller, history) => {
    return {
      type: UPDATE_SELLER,
      payload: { seller, history },
    };
  };
  
  export const updateSellerSuccess = (seller) => {
    return {
      type: UPDATE_SELLER_SUCCESS,
      payload: seller,
    };
  };
  
  export const loadSellers = () => {
    return {
      type: LOAD_SELLERS,
      payload: {},
    };
  };
  
  export const loadSellersSuccess = (sellers) => {
    return {
      type: LOAD_SELLERS_SUCCESS,
      payload: sellers,
    };
  };
  
  export const sellerApiError = (error) => {
    return {
      type: SELLER_API_ERROR,
      payload: error,
    };
  };
  