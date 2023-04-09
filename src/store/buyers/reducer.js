import {
    SUBMIT_BUYERS,
    SUBMIT_BUYERS_SUCCESS,
    UPDATE_BUYERS,
    UPDATE_BUYERS_SUCCESS,
    BUYER_API_ERROR,
    LOAD_BUYERS,
    LOAD_BUYERS_SUCCESS,
  } from "./actionTypes";
  
  const initialState = {
    error: "",
    loading: false,
  };
  
  const buyers = (state = initialState, action) => {
    switch (action.type) {
      case SUBMIT_BUYERS:
        state = {
          ...state,
          loading: true,
        };
        break;
      case SUBMIT_BUYERS_SUCCESS:
        state = {
          ...state,
          loading: false,
          message: "Buyer added successfully.",
          message_type: "Success",
        };
        break;
        case UPDATE_BUYERS:
          state = {
            ...state,
            loading: true,
          };
          break;
        case UPDATE_BUYERS_SUCCESS:
          state = {
            ...state,
            loading: false,
            message: "Buyer update successfully.",
            message_type: "Success",
          };
          break;
      case LOAD_BUYERS:
        state = {
          ...state,
          loading: true,
        };
        break;
      case LOAD_BUYERS_SUCCESS:
        state = {
          ...state,
          loading: false,
          buyers: action.payload.data,
        };
        break;
  
      case BUYER_API_ERROR:
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
  
  export default buyers;
  