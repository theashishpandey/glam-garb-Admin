import {
  LOAD_ALL_PRODUCTS,
  LOAD_ALL_PRODUCTS_SUCCESS,
  PRODUCT_API_ERROR,
} from "./actionTypes";

export const loadAllProducts = () => {
  return {
    type: LOAD_ALL_PRODUCTS,
    payload: {},
  };
};

export const loadAllProductsSuccess = (products) => {
  return {
    type: LOAD_ALL_PRODUCTS_SUCCESS,
    payload: products,
  };
};

export const productsApiError = (error) => {
  return {
    type: PRODUCT_API_ERROR,
    payload: error,
  };
};
