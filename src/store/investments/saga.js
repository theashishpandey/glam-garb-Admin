import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_INVESTMENT,
  LOAD_INVESTMENTS,
  UPDATE_INVESTMENT,
} from "./actionTypes";
import {
  submitInvestmentSuccess,
  loadInvestmentsSuccess,
  updateInvestmentSuccess,
  investmentsApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitInvestment({ payload: { investment, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "investments/insert";

    const response = yield call(postSubmitForm, url, investment);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshInvestments();
      yield put(submitInvestmentSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(investmentsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(investmentsApiError(error));
  }
}
export function* watchSubmitInvestment() {
  yield takeEvery(SUBMIT_INVESTMENT, submitInvestment);
}

function* loadInvestments({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "investments/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadInvestmentsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(investmentsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(investmentsApiError(error));
  }
}
export function* watchLoadInvestments() {
  yield takeEvery(LOAD_INVESTMENTS, loadInvestments);
}

function* updateInvestment({ payload: { investment, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "investments/update";
    const response = yield call(postSubmitForm, url, investment);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshInvestments();
      yield put(updateInvestmentSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(investmentsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(investmentsApiError(error));
  }
}
export function* watchUpdateInvestment() {
  yield takeEvery(UPDATE_INVESTMENT, updateInvestment);
}

function* loadRefreshInvestments() {
  try {
    let url = process.env.REACT_APP_BASEURL + "investments/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadInvestmentsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(investmentsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(investmentsApiError(error));
  }
}

function* investmentSaga() {
  yield all([
    fork(watchSubmitInvestment),
    fork(watchLoadInvestments),
    fork(watchUpdateInvestment),
  ]);
}

export default investmentSaga;
