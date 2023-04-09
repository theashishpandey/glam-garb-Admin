import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_EMPLOYEE,
  LOAD_EMPLOYEES,
  UPDATE_EMPLOYEE,
} from "./actionTypes";
import {
  submitEmployeeSuccess,
  loadEmployeesSuccess,
  updateEmployeeSuccess,
  employeesApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitEmployee({ payload: { employee, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "employees/insert";

    const response = yield call(postSubmitForm, url, employee);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshEmployees();
      yield put(submitEmployeeSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(employeesApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(employeesApiError(error));
  }
}
export function* watchSubmitEmployee() {
  yield takeEvery(SUBMIT_EMPLOYEE, submitEmployee);
}

function* loadEmployees({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "employees/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadEmployeesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(loadEmployeesSuccess(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(employeesApiError(error));
  }
}
export function* watchLoadEmployees() {
  yield takeEvery(LOAD_EMPLOYEES, loadEmployees);
}

function* updateEmployee({ payload: { employee, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "employees/update";
    const response = yield call(postSubmitForm, url, employee);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshEmployees();
      yield put(updateEmployeeSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(employeesApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(employeesApiError(error));
  }
}
export function* watchUpdateEmployee() {
  yield takeEvery(UPDATE_EMPLOYEE, updateEmployee);
}

function* loadRefreshEmployees() {
  try {
    let url = process.env.REACT_APP_BASEURL + "employees/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadEmployeesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(employeesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(employeesApiError(error));
  }
}

function* employeesSaga() {
  yield all([
    fork(watchSubmitEmployee),
    fork(watchLoadEmployees),
    fork(watchUpdateEmployee),
  ]);
}

export default employeesSaga;
