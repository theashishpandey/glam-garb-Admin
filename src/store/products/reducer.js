import {
  LOAD_ALL_PRODUCTS,
  LOAD_ALL_PRODUCTS_SUCCESS,
  PRODUCT_API_ERROR,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
};

const products = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_PRODUCTS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ALL_PRODUCTS_SUCCESS:
      state = {
        ...state,
        loading: false,
        all_product_details: action.payload.data,
      };
      break;
    case PRODUCT_API_ERROR:
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

export default products;
