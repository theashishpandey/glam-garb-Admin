import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { SUBMIT_SELLER, UPDATE_SELLER, LOAD_SELLERS } from "./actionTypes";
import {
  submitSellerSuccess,
  updateSellerSuccess,
  loadSellersSuccess,
  sellerApiError,
} from "./actions";
// For notifications
//import toastr from "toastr";
import "toastr/build/toastr.min.css";
//import swal from "sweetalert2";
//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitSeller({ payload: { seller, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "sellers/insert";

    const response = yield call(postSubmitForm, url, seller);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshSellers();
      yield put(submitSellerSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(sellerApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(sellerApiError(error));
  }
}

function* updateSeller({ payload: { seller, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "sellers/update";

    const response = yield call(postSubmitForm, url, seller);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshSellers();
      yield put(updateSellerSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(sellerApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(sellerApiError(error));
  }
}
export function* watchSubmitSeller() {
  yield takeEvery(SUBMIT_SELLER, submitSeller);
}
export function* watchUpdateSeller() {
  yield takeEvery(UPDATE_SELLER, updateSeller);
}
//Load All Sellers
function* loadSellers({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "sellers/getall";
    const response = yield call(postSubmitForm, url, "");

    if (response.status === 1) {
      yield put(loadSellersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(sellerApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(sellerApiError(error));
  }
}
export function* watchLoadSellers() {
  yield takeEvery(LOAD_SELLERS, loadSellers);
}

function* loadrefreshSellers() {
  try {
    let url = process.env.REACT_APP_BASEURL + "sellers/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadSellersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(sellerApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(sellerApiError(error));
  }
}

function* sellerSaga() {
  yield all([
    fork(watchSubmitSeller),
    fork(watchUpdateSeller),
    fork(watchLoadSellers),
  ]);
}

export default sellerSaga;
