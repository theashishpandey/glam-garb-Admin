import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import { SUBMIT_INCOME, LOAD_INCOMES } from "./actionTypes";
import {
  submitIncomeSuccess,
  loadIncomesSuccess,
  incomesApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitIncome({ payload: { income, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "incomes/insert";

    const response = yield call(postSubmitForm, url, income);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshIncomes();
      yield put(submitIncomeSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(incomesApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(incomesApiError(error));
  }
}
export function* watchSubmitIncome() {
  yield takeEvery(SUBMIT_INCOME, submitIncome);
}

function* loadIncomes({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "incomes/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadIncomesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(incomesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(incomesApiError(error));
  }
}
export function* watchLoadIncomes() {
  yield takeEvery(LOAD_INCOMES, loadIncomes);
}

function* loadRefreshIncomes() {
  try {
    let url = process.env.REACT_APP_BASEURL + "incomes/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadIncomesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(incomesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(incomesApiError(error));
  }
}

function* incomeSaga() {
  yield all([fork(watchSubmitIncome), fork(watchLoadIncomes)]);
}

export default incomeSaga;
