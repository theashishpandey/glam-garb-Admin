import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_SOURCE,
  LOAD_SOURCES,
  LOAD_SOURCES_BY_TYPE,
} from "./actionTypes";
import {
  submitSourceSuccess,
  loadSourcesSuccess,
  sourcesApiError,
  loadSourcesByTypeSuccess,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitSource({ payload: { source, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "sources/insert";

    const response = yield call(postSubmitForm, url, source);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshSources();
      yield put(submitSourceSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(sourcesApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(sourcesApiError(error));
  }
}
export function* watchSubmitSource() {
  yield takeEvery(SUBMIT_SOURCE, submitSource);
}

function* loadSources({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "sources/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadSourcesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(sourcesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(sourcesApiError(error));
  }
}
export function* watchLoadSources() {
  yield takeEvery(LOAD_SOURCES, loadSources);
}

function* loadSourcesByType({ payload: { sourcetype } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "sources/getbytype";
    const response = yield call(postSubmitForm, url, sourcetype);

    if (response.status === 1) {
      yield put(loadSourcesByTypeSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(sourcesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(sourcesApiError(error));
  }
}
export function* watchLoadSourcesByType() {
  yield takeEvery(LOAD_SOURCES_BY_TYPE, loadSourcesByType);
}

function* loadRefreshSources() {
  try {
    let url = process.env.REACT_APP_BASEURL + "sources/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadSourcesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(sourcesApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(sourcesApiError(error));
  }
}

function* sourceSaga() {
  yield all([
    fork(watchSubmitSource),
    fork(watchLoadSources),
    fork(watchLoadSourcesByType),
  ]);
}

export default sourceSaga;
