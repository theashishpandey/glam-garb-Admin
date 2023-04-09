import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import { LOAD_ACCOUNTS, LOAD_SALES, LOAD_SALES_SUCCESS } from "./actionTypes";
import {
  loadAccountsSuccess,
  loadSalesSuccess,
  ReportsApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

//Load All item
function* loadSales({ payload: sales_input }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/getbystatus_daterange";
    let urlLine =
      process.env.REACT_APP_BASEURL + "orders/salesreport_daterange_line";
    let urlPie =
      process.env.REACT_APP_BASEURL + "orders/salesreport_daterange_pie";
    const response = yield call(postSubmitForm, url, sales_input);
    const responseLine = yield call(postSubmitForm, urlLine, sales_input);
    const responsePie = yield call(postSubmitForm, urlPie, sales_input);

    const finalresponse = {
      response: response.data,
      responseLine: responseLine.data,
      responsePie: responsePie.data,
    };
    if (
      response.status === 1 &&
      responseLine.status === 1 &&
      responsePie.status === 1
    ) {
      yield put(loadSalesSuccess(finalresponse));
    } else {
      showNotification(response.message, "Error");
      yield put(ReportsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ReportsApiError(error));
  }
}
export function* watchLoadSales() {
  yield takeEvery(LOAD_SALES, loadSales);
}

//Load Accounts
function* loadAccounts({ payload: accounts_input }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/account_daterange";
    const response = yield call(postSubmitForm, url, accounts_input);

    if (response.status === 1) {
      yield put(loadAccountsSuccess(response.data));
    } else {
      showNotification(response.message, "Error");
      yield put(ReportsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ReportsApiError(error));
  }
}
export function* watchLoadAccounts() {
  yield takeEvery(LOAD_ACCOUNTS, loadAccounts);
}

function* reportsSaga() {
  yield all([fork(watchLoadSales), fork(watchLoadAccounts)]);
}

export default reportsSaga;
