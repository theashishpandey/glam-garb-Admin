import {
    SUBMIT_SELLER,
    SUBMIT_SELLER_SUCCESS,
    UPDATE_SELLER,
    UPDATE_SELLER_SUCCESS,
    SELLER_API_ERROR,
    LOAD_SELLERS,
    LOAD_SELLERS_SUCCESS,
  } from "./actionTypes";
  
  const initialState = {
    error: "",
    loading: false,
  };
  
  const sellers = (state = initialState, action) => {
    switch (action.type) {
      case SUBMIT_SELLER:
        state = {
          ...state,
          loading: true,
        };
        break;
      case SUBMIT_SELLER_SUCCESS:
        state = {
          ...state,
          loading: false,
          message: "Seller added successfully.",
          message_type: "Success",
        };
        break;
        case UPDATE_SELLER:
        state = {
          ...state,
          loading: true,
        };
        break;
      case UPDATE_SELLER_SUCCESS:
        state = {
          ...state,
          loading: false,
          message: "Seller updated successfully.",
          message_type: "Success",
        };
        break;
      case LOAD_SELLERS:
        state = {
          ...state,
          loading: true,
        };
        break;
      case LOAD_SELLERS_SUCCESS:
        state = {
          ...state,
          loading: false,
          sellers: action.payload.data,
        };
        break;
  
      case SELLER_API_ERROR:
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
  
  export default sellers;
  