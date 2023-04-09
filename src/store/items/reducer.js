import {
  SUBMIT_ITEM,
  SUBMIT_ITEM_SUCCESS,
  ITEM_API_ERROR,
  LOAD_ITEM,
  LOAD_ITEM_SUCCESS,
  LOAD_PRODUCT_DETAILS,
  LOAD_PRODUCT_DETAILS_SUCCESS,
  UPDATE_ITEM,
  UPDATE_ITEM_SUCCESS,
  LOAD_LIVE_ITEM,
  LOAD_LIVE_ITEM_SUCCESS,
  ADD_CATEGORY,
  ADD_CATEGORY_SUCCESS,
  LOAD_CATEGORIES,
  LOAD_CATEGORIES_SUCCESS,
  ADD_BRAND_SUCCESS,
  ADD_BRAND,
  LOAD_PRODUCT_DETAILS_FOR_MODEL,
  LOAD_PRODUCT_DETAILS_FOR_MODEL_SUCCESS,
  LOAD_MODELS,
  LOAD_MODELS_SUCCESS,
  LOAD_EXPIRED_ITEMS,
  LOAD_EXPIRED_ITEMS_SUCCESS,
  LOAD_SELLERWISE_ITEMS,
  LOAD_SELLERWISE_ITEMS_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  product_details: [],
  products_loading: "not_initiated",
};

const item = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_ITEM:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_ITEM_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "Item added successfully.",
        message_type: "Success",
      };
      break;
    case ADD_CATEGORY:
      state = {
        ...state,
        loading: true,
      };
      break;
    case ADD_CATEGORY_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "Category added successfully.",
        message_type: "Success",
      };
      break;
    case ADD_BRAND:
      state = {
        ...state,
        loading: true,
      };
      break;
    case ADD_BRAND_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "Brand added successfully.",
        message_type: "Success",
      };
      break;
    case LOAD_CATEGORIES:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_CATEGORIES_SUCCESS:
      state = {
        ...state,
        loading: false,
        categories: action.payload.data,
      };
      break;

    case LOAD_ITEM:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ITEM_SUCCESS:
      state = {
        ...state,
        loading: false,
        all_items: action.payload.data,
      };
      break;
    case LOAD_LIVE_ITEM:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_LIVE_ITEM_SUCCESS:
      state = {
        ...state,
        loading: false,
        all_live_items: action.payload.data,
      };
      break;
    case LOAD_MODELS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_MODELS_SUCCESS:
      state = {
        ...state,
        loading: false,
        models: action.payload.data.models,
      };
      break;

    case LOAD_PRODUCT_DETAILS:
      state = {
        ...state,
        loading: true,
        products_loading: "loading",
      };
      break;
    case LOAD_PRODUCT_DETAILS_SUCCESS:
      state = {
        ...state,
        loading: false,
        product_details: action.payload.data,
        products_loading: "loaded",
      };
      break;
    case LOAD_PRODUCT_DETAILS_FOR_MODEL:
      state = {
        ...state,
        loading: true,
        products_loading: "loading",
      };
      break;
    case LOAD_PRODUCT_DETAILS_FOR_MODEL_SUCCESS:
      state = {
        ...state,
        loading: false,
        product_details_for_model: action.payload.data,
        products_loading: "loaded",
      };
      break;
    case UPDATE_ITEM:
      state = {
        ...state,
        loading: true,
      };
      break;
    case UPDATE_ITEM_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "Item updated successfully.",
        message_type: "Success",
      };
      break;
    case LOAD_EXPIRED_ITEMS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_EXPIRED_ITEMS_SUCCESS:
      state = {
        ...state,
        loading: false,
        expired_items: action.payload.data,
      };
      break;
    case LOAD_SELLERWISE_ITEMS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_SELLERWISE_ITEMS_SUCCESS:
      state = {
        ...state,
        loading: false,
        sellerwise_items: action.payload.data,
      };
      break;

    case ITEM_API_ERROR:
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

export default item;
