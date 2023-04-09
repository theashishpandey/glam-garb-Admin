import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import { SUBMIT_EXPENSE, LOAD_EXPENSES } from "./actionTypes";
import {
  submitExpenseSuccess,
  loadExpensesSuccess,
  expensesApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitExpense({ payload: { expense, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "expenses/insert";

    const response = yield call(postSubmitForm, url, expense);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshExpenses();
      yield put(submitExpenseSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(expensesApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(expensesApiError(error));
  }
}
export function* watchSubmitExpense() {
  yield takeEvery(SUBMIT_EXPENSE, submitExpense);
}

function* loadExpenses({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "expenses/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadExpensesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(expensesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(expensesApiError(error));
  }
}
export function* watchLoadExpenses() {
  yield takeEvery(LOAD_EXPENSES, loadExpenses);
}

function* loadRefreshExpenses() {
  try {
    let url = process.env.REACT_APP_BASEURL + "expenses/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadExpensesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(expensesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(expensesApiError(error));
  }
}

function* expenseSaga() {
  yield all([fork(watchSubmitExpense), fork(watchLoadExpenses)]);
}

export default expenseSaga;
