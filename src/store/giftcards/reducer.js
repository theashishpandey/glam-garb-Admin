import {
    SUBMIT_GIFTCARDS,
    SUBMIT_GIFTCARDS_SUCCESS,
    GIFTCARDS_API_ERROR,
    LOAD_GIFTCARDS,
    LOAD_GIFTCARDS_SUCCESS,
   
  } from "./actionTypes";
  
  const initialState = {
    error: "",
    loading: false,
  };
  
  const giftcards = (state = initialState, action) => {
    switch (action.type) {
      case SUBMIT_GIFTCARDS:
        state = {
          ...state,
          loading: true,
        };
        break;
      case SUBMIT_GIFTCARDS_SUCCESS:
        state = {
          ...state,
          loading: false,
          message: "giftcards added successfully.",
          message_type: "Success",
        };
        break;
      case LOAD_GIFTCARDS:
        state = {
          ...state,
          loading: true,
        };
        break;
      case LOAD_GIFTCARDS_SUCCESS:
        state = {
          ...state,
          loading: false,
          giftcards: action.payload.data,
        };
        break;
      
        case GIFTCARDS_API_ERROR:
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
  
  export default giftcards;
  