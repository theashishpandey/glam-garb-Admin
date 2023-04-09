import { takeEvery, fork, put, all, call } from "redux-saga/effects";
// import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_ADDUSER,
  LOAD_ADDUSER,
  LOAD_GETBYROLE,
  UPDATE_USER,
  ACTIVATE_DEACTIVATE_USER,
} from "./actionTypes";
import {
  submitAddUserSuccess,
  loadAddUserSuccess,
  adduserApiError,
  loadgetByRoleSuccess,
  updateUserSuccess,
  activate_deactivateUserSuccess,
} from "./actions";
// For notifications
// import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitAddUser({ payload: { adduser, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/registration";

    const response = yield call(postSubmitForm, url, adduser);

    if (response.status === 1) {
      showNotification("User Added Successfully.", "Success");
      yield* loadrefreshAddUser();
      yield put(submitAddUserSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(adduserApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(adduserApiError(error));
  }
}
export function* watchSubmitAddUser() {
  yield takeEvery(SUBMIT_ADDUSER, submitAddUser);
}

function* updateUser({ payload: { user, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/update";
    console.log(user);
    const response = yield call(postSubmitForm, url, user);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshAddUser();
      yield put(updateUserSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(adduserApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(adduserApiError(error));
  }
}
export function* watchUpdateUser() {
  yield takeEvery(UPDATE_USER, updateUser);
}

function* activate_deactivateUser({ payload: { user_status, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/activate_deactivate";
    console.log(user_status);
    const response = yield call(postSubmitForm, url, user_status);

    if (response.status === 1) {
      user_status.is_active
        ? showNotification(response.message, "Success")
        : showNotification(response.message, "Success");
      yield* loadrefreshAddUser();
      yield put(activate_deactivateUserSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(adduserApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(adduserApiError(error));
  }
}
export function* watchActivate_deactivateUser() {
  yield takeEvery(ACTIVATE_DEACTIVATE_USER, activate_deactivateUser);
}

//Load All User
function* loadAddUser({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadAddUserSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(adduserApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(adduserApiError(error));
  }
}
export function* watchLoadAddUser() {
  yield takeEvery(LOAD_ADDUSER, loadAddUser);
}

function* loadgetByRole({ payload: { role } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/getbyrole";
    let response = {};
    if (role.role === "manager") {
      response = yield call(postSubmitForm, url, role);
    } else {
      response = {
        status: 1,
        message: "Query executed successfully.",
        data: [{ username: "admin", name: "Administrator" }],
      };
    }
    if (response.status === 1) {
      yield put(loadgetByRoleSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(adduserApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(adduserApiError(error));
  }
}
export function* watchLoadGetByRole() {
  yield takeEvery(LOAD_GETBYROLE, loadgetByRole);
}

function* loadrefreshAddUser() {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadAddUserSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(adduserApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(adduserApiError(error));
  }
}

function* adduserSaga() {
  yield all([
    fork(watchSubmitAddUser),
    fork(watchLoadAddUser),
    fork(watchLoadGetByRole),
    fork(watchUpdateUser),
    fork(watchActivate_deactivateUser),
  ]);
}

export default adduserSaga;
