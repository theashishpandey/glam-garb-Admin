import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import { SUBMIT_BUYERS, UPDATE_BUYERS, LOAD_BUYERS } from "./actionTypes";
import {
  submitBuyersSuccess,
  updateBuyersSuccess,
  loadBuyersSuccess,
  buyerApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";
function* submitBuyers({ payload: { buyers, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "buyers/insert";

    const response = yield call(postSubmitForm, url, buyers);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshBuyers();
      yield put(submitBuyersSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(buyerApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(buyerApiError(error));
  }
}
export function* watchSubmitBuyers() {
  yield takeEvery(SUBMIT_BUYERS, submitBuyers);
}

function* updateBuyers({ payload: { buyers, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "buyers/update";

    const response = yield call(postSubmitForm, url, buyers);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshBuyers();
      yield put(updateBuyersSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(buyerApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(buyerApiError(error));
  }
}
export function* watchUpdateBuyers() {
  yield takeEvery(UPDATE_BUYERS, updateBuyers);
}
//Load All Buyers
function* loadBuyers({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "buyers/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadBuyersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(buyerApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(buyerApiError(error));
  }
}
export function* watchLoadBuyers() {
  yield takeEvery(LOAD_BUYERS, loadBuyers);
}

function* loadrefreshBuyers() {
  try {
    let url = process.env.REACT_APP_BASEURL + "buyers/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadBuyersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(buyerApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(buyerApiError(error));
  }
}

function* buyerSaga() {
  yield all([
    fork(watchSubmitBuyers),
    fork(watchUpdateBuyers),
    fork(watchLoadBuyers),
  ]);
}

export default buyerSaga;
