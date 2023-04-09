import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import { LOAD_ALL_PRODUCTS } from "./actionTypes";
import { loadAllProductsSuccess, productsApiError } from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

//Load All Products
function* loadAllProducts({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "products/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadAllProductsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(productsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(productsApiError(error));
  }
}
export function* watchLoadAllProducts() {
  yield takeEvery(LOAD_ALL_PRODUCTS, loadAllProducts);
}

function* productsSaga() {
  yield all([fork(watchLoadAllProducts)]);
}

export default productsSaga;
