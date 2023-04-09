import {
  SUBMIT_ITEM,
  SUBMIT_ITEM_SUCCESS,
  UPDATE_ITEM,
  UPDATE_ITEM_SUCCESS,
  ITEM_API_ERROR,
  LOAD_ITEM,
  LOAD_ITEM_SUCCESS,
  LOAD_LIVE_ITEM,
  LOAD_LIVE_ITEM_SUCCESS,
  LOAD_PRODUCT_DETAILS,
  LOAD_PRODUCT_DETAILS_SUCCESS,
  RETURN_ITEM,
  RETURN_ITEM_SUCCESS,
  ADD_CATEGORY,
  ADD_CATEGORY_SUCCESS,
  LOAD_CATEGORIES,
  LOAD_CATEGORIES_SUCCESS,
  ADD_BRAND,
  ADD_BRAND_SUCCESS,
  LOAD_PRODUCT_DETAILS_FOR_MODEL_SUCCESS,
  LOAD_PRODUCT_DETAILS_FOR_MODEL,
  ADD_MODEL,
  ADD_MODEL_SUCCESS,
  LOAD_MODELS,
  LOAD_MODELS_SUCCESS,
  LOAD_EXPIRED_ITEMS,
  LOAD_EXPIRED_ITEMS_SUCCESS,
  LOAD_SELLERWISE_ITEMS,
  LOAD_SELLERWISE_ITEMS_SUCCESS,
} from "./actionTypes";

export const submitItem = (item, history) => {
  return {
    type: SUBMIT_ITEM,
    payload: { item, history },
  };
};

export const submitItemSuccess = (item) => {
  return {
    type: SUBMIT_ITEM_SUCCESS,
    payload: item,
  };
};

export const addCategory = (category, history) => {
  return {
    type: ADD_CATEGORY,
    payload: { category, history },
  };
};

export const addCategorySuccess = (category) => {
  return {
    type: ADD_CATEGORY_SUCCESS,
    payload: category,
  };
};

export const addBrand = (brand, history) => {
  return {
    type: ADD_BRAND,
    payload: { brand, history },
  };
};

export const addBrandSuccess = (brand) => {
  return {
    type: ADD_BRAND_SUCCESS,
    payload: brand,
  };
};

export const addModel = (model, history) => {
  return {
    type: ADD_MODEL,
    payload: { model, history },
  };
};

export const addModelSuccess = (model) => {
  return {
    type: ADD_MODEL_SUCCESS,
    payload: model,
  };
};

export const loadModels = (category_brand) => {
  return {
    type: LOAD_MODELS,
    payload: { category_brand },
  };
};

export const loadModelsSuccess = (models) => {
  return {
    type: LOAD_MODELS_SUCCESS,
    payload: models,
  };
};

export const updateItem = (item, history) => {
  return {
    type: UPDATE_ITEM,
    payload: { item, history },
  };
};

export const updateItemSuccess = (item) => {
  return {
    type: UPDATE_ITEM_SUCCESS,
    payload: item,
  };
};

export const loadItem = () => {
  return {
    type: LOAD_ITEM,
    payload: {},
  };
};

export const loadItemSuccess = (item) => {
  return {
    type: LOAD_ITEM_SUCCESS,
    payload: item,
  };
};

export const loadCategories = () => {
  return {
    type: LOAD_CATEGORIES,
    payload: {},
  };
};

export const loadCategoriesSuccess = (categories) => {
  return {
    type: LOAD_CATEGORIES_SUCCESS,
    payload: categories,
  };
};

export const loadLiveItem = (inventory_status) => {
  return {
    type: LOAD_LIVE_ITEM,
    payload: { inventory_status },
  };
};

export const loadLiveItemSuccess = (item) => {
  return {
    type: LOAD_LIVE_ITEM_SUCCESS,
    payload: item,
  };
};

export const loadProductDetails = (category) => {
  return {
    type: LOAD_PRODUCT_DETAILS,
    payload: { category },
  };
};

export const loadProductDetailsSuccess = (product_details) => {
  return {
    type: LOAD_PRODUCT_DETAILS_SUCCESS,
    payload: product_details,
  };
};

export const loadProductDetailsForModel = (category) => {
  return {
    type: LOAD_PRODUCT_DETAILS_FOR_MODEL,
    payload: { category },
  };
};

export const loadProductDetailsForModelSuccess = (product_details) => {
  return {
    type: LOAD_PRODUCT_DETAILS_FOR_MODEL_SUCCESS,
    payload: product_details,
  };
};

export const returnItem = (item) => {
  console.log("hello action");
  return {
    type: RETURN_ITEM,
    payload: { item },
  };
};

export const returnItemSuccess = (item) => {
  return {
    type: RETURN_ITEM_SUCCESS,
    payload: item,
  };
};

export const loadExpiredItems = () => {
  return {
    type: LOAD_EXPIRED_ITEMS,
    payload: {},
  };
};

export const loadExpiredItemsSuccess = (item) => {
  return {
    type: LOAD_EXPIRED_ITEMS_SUCCESS,
    payload: item,
  };
};

export const loadSellerwiseItems = (seller) => {
  return {
    type: LOAD_SELLERWISE_ITEMS,
    payload: { seller },
  };
};

export const loadSellerwiseItemsSuccess = (item) => {
  return {
    type: LOAD_SELLERWISE_ITEMS_SUCCESS,
    payload: item,
  };
};

export const ItemApiError = (error) => {
  return {
    type: ITEM_API_ERROR,
    payload: error,
  };
};
