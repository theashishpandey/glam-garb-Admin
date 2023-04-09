import {
    SUBMIT_GIFTCARDS,
    SUBMIT_GIFTCARDS_SUCCESS,
    GIFTCARDS_API_ERROR,
    LOAD_GIFTCARDS,
    LOAD_GIFTCARDS_SUCCESS,
   
  } from "./actionTypes";
  
  export const submitGiftCards = (giftcards, history) => {
    return {
      type: SUBMIT_GIFTCARDS,
      payload: { giftcards, history },
    };
  };
  
  export const submitGiftCardsSuccess = (giftcards) => {
    return {
      type: SUBMIT_GIFTCARDS_SUCCESS,
      payload: giftcards,
    };
  };
  
  export const loadGiftCards = () => {
    return {
      type: LOAD_GIFTCARDS,
      payload: {},
    };
  };
  
  export const loadGiftCardsSuccess = (giftcards) => {
    return {
      type: LOAD_GIFTCARDS_SUCCESS,
      payload: giftcards,
    };
  };
  
  export const GiftCardsApiError = (error) => {
    return {
      type: GIFTCARDS_API_ERROR,
      payload: error,
    };
  };
  
 