import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_ITEM,
  LOAD_ITEM,
  LOAD_PRODUCT_DETAILS,
  UPDATE_ITEM,
  RETURN_ITEM,
  LOAD_LIVE_ITEM,
  ADD_CATEGORY,
  LOAD_CATEGORIES,
  ADD_BRAND,
  LOAD_PRODUCT_DETAILS_FOR_MODEL,
  ADD_MODEL,
  LOAD_MODELS,
  LOAD_EXPIRED_ITEMS,
  LOAD_SELLERWISE_ITEMS,
} from "./actionTypes";
import {
  submitItemSuccess,
  loadItemSuccess,
  loadLiveItemSuccess,
  ItemApiError,
  loadProductDetailsSuccess,
  updateItemSuccess,
  addCategorySuccess,
  loadCategoriesSuccess,
  addBrandSuccess,
  loadProductDetailsForModelSuccess,
  addModelSuccess,
  loadModelsSuccess,
  loadExpiredItemsSuccess,
  loadSellerwiseItemsSuccess,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* addCategory({ payload: { category, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "categories/insert";

    const response = yield call(postSubmitForm, url, category);
    console.log(response);
    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* refreshCategories();
      yield put(addCategorySuccess(response));
    } else {
      //console.log(response);
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchAddCategory() {
  yield takeEvery(ADD_CATEGORY, addCategory);
}

function* refreshCategories() {
  try {
    let url = process.env.REACT_APP_BASEURL + "categories/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadCategoriesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
function* loadCategories({ payload: { category, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "categories/getall";

    const response = yield call(postSubmitForm, url, category);

    if (response.status === 1) {
      //showNotification("Category added successfully.", "Success");
      //yield* loadrefreshItem();
      yield put(loadCategoriesSuccess(response));
    } else {
      //console.log(response);
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadCategories() {
  yield takeEvery(LOAD_CATEGORIES, loadCategories);
}

function* submitItem({ payload: { item, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/insert";
    console.log(item);
    const response = yield call(postSubmitForm, url, item);
    console.log(response);
    if (response.status === 1) {
      showNotification("Item added successfully.", "Success");
      yield* loadrefreshItem();
      yield put(submitItemSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchSubmitItem() {
  yield takeEvery(SUBMIT_ITEM, submitItem);
}
//Load All item
function* loadItem({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadItem() {
  yield takeEvery(LOAD_ITEM, loadItem);
}

//Load Expired items
function* loadExpiredItems({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getexpired";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadExpiredItemsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadExpiredItems() {
  yield takeEvery(LOAD_EXPIRED_ITEMS, loadExpiredItems);
}

//Load All live items
function* loadLiveItems({ payload: { inventory_status } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getbystatus";
    const response = yield call(postSubmitForm, url, inventory_status);

    if (response.status === 1) {
      yield put(loadLiveItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadLiveItems() {
  yield takeEvery(LOAD_LIVE_ITEM, loadLiveItems);
}

function* updateItem({ payload: { item, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/update";

    const response = yield call(postSubmitForm, url, item);
    console.log(response);
    if (response.status === 1) {
      showNotification("Item updated successfully.", "Success");
      yield* loadrefreshItem();
      yield* loadrefreshItemByStatus();
      yield put(updateItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchUpdateItem() {
  yield takeEvery(UPDATE_ITEM, updateItem);
}

function* returnItem({ payload: { item, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/return_to_seller";

    const response = yield call(postSubmitForm, url, item);
    console.log(response);
    if (response.status === 1) {
      showNotification("Item returned successfully.", "Success");
      yield* loadrefreshItem();
      yield put(updateItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchReturnItem() {
  yield takeEvery(RETURN_ITEM, returnItem);
}

function* loadProductDetails({ payload: { category } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/getbycategory";

    const response = yield call(postSubmitForm, url, category);

    if (response.status === 1) {
      yield put(loadProductDetailsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadProductDetails() {
  yield takeEvery(LOAD_PRODUCT_DETAILS, loadProductDetails);
}

function* loadProductDetailsForModel({ payload: { category } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/getbycategory";

    const response = yield call(postSubmitForm, url, category);

    if (response.status === 1) {
      yield put(loadProductDetailsForModelSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadProductDetailsForModel() {
  yield takeEvery(LOAD_PRODUCT_DETAILS_FOR_MODEL, loadProductDetailsForModel);
}

function* addBrand({ payload: { brand, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/insertbrand";
    const brand_details = {
      category: brand.category,
      brand: brand.brand,
    };
    const selectedCategory = { category: brand.selected_category };
    const response = yield call(postSubmitForm, url, brand_details);
    //console.log(response);
    if (response.status === 1) {
      showNotification("Brand added successfully.", "Success");
      if (brand.selected_category != "") {
        yield* refreshProductDetails(selectedCategory);
      }
      yield put(addBrandSuccess(response));
    } else {
      //console.log(response);
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchAddBrand() {
  yield takeEvery(ADD_BRAND, addBrand);
}

function* addModel({ payload: { model, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/insertmodel";
    const model_details = {
      category: model.category,
      brand: model.brand,
      model: model.model,
    };
    const selectedCategory = {
      category: model.selected_category,
      brand: model.selected_brand,
    };
    const response = yield call(postSubmitForm, url, model_details);
    //console.log(response);
    if (response.status === 1) {
      showNotification("Model added successfully.", "Success");
      if (model.selected_category && model.selected_brand) {
        yield* refreshModels(selectedCategory);
      }
      yield put(addModelSuccess(response));
    } else {
      //console.log(response);
      showNotification(response.message, "Error");
      yield put(ItemApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchAddModel() {
  yield takeEvery(ADD_MODEL, addModel);
}
function* loadModels({ payload: { category_brand } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/getbycategorybrand";

    const response = yield call(postSubmitForm, url, category_brand);

    if (response.status === 1) {
      yield put(loadModelsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadModels() {
  yield takeEvery(LOAD_MODELS, loadModels);
}

//Load All live items
function* loadSellerwiseItems({ payload: { seller } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getbyseller";
    const response = yield call(postSubmitForm, url, seller);

    if (response.status === 1) {
      yield put(loadSellerwiseItemsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
export function* watchLoadSellerwiseItems() {
  yield takeEvery(LOAD_SELLERWISE_ITEMS, loadSellerwiseItems);
}

function* refreshModels(category) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/getbycategorybrand";

    const response = yield call(postSubmitForm, url, category);

    if (response.status === 1) {
      yield put(loadModelsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}

function* refreshProductDetails(category) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/getbycategory";

    const response = yield call(postSubmitForm, url, category);

    if (response.status === 1) {
      yield put(loadProductDetailsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}

function* loadrefreshItem() {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}
function* loadrefreshItemByStatus() {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getbystatus";
    const response = yield call(postSubmitForm, url, {
      inventory_status: "all",
    });

    if (response.status === 1) {
      yield put(loadLiveItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}

function* itemSaga() {
  yield all([
    fork(watchSubmitItem),
    fork(watchLoadItem),
    fork(watchLoadProductDetails),
    fork(watchUpdateItem),
    fork(watchReturnItem),
    fork(watchLoadLiveItems),
    fork(watchLoadCategories),
    fork(watchAddCategory),
    fork(watchAddBrand),
    fork(watchAddModel),
    fork(watchLoadProductDetailsForModel),
    fork(watchLoadModels),
    fork(watchLoadExpiredItems),
    fork(watchLoadSellerwiseItems),
  ]);
}

export default itemSaga;
