import { takeEvery, fork, put, all, call } from "redux-saga/effects";
// import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_CAR,
  SUBMIT_CAR_MAKE,
  LOAD_CARS,
  LOAD_CAR_MAKES,
  SUBMIT_CAR_MODEL,
  SUBMIT_CAR_VARIANT,
} from "./actionTypes";
import {
  submitCarSuccess,
  submitCarMakeSuccess,
  loadCarsSuccess,
  loadCarMakesSuccess,
  carsApiError,
  submitCarModelSuccess,
  submitCarVariantSuccess,
} from "./actions";
// For notifications
// import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitCar({ payload: { car, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "cars/insert";

    const response = yield call(postSubmitForm, url, car);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshCars();
      yield put(submitCarSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(carsApiError(error));
  }
}
export function* watchSubmitCar() {
  yield takeEvery(SUBMIT_CAR, submitCar);
}

function* submitCarMake({ payload: { carmake, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "vehicles/insert_make";

    const response = yield call(postSubmitForm, url, carmake);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshCarMakes();
      yield put(submitCarMakeSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(carsApiError(error));
  }
}
export function* watchSubmitCarMake() {
  yield takeEvery(SUBMIT_CAR_MAKE, submitCarMake);
}

function* submitCarModel({ payload: { carmodel, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "vehicles/insert_model";

    const response = yield call(postSubmitForm, url, carmodel);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshCarMakes();
      yield put(submitCarModelSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(carsApiError(error));
  }
}
export function* watchSubmitCarModel() {
  yield takeEvery(SUBMIT_CAR_MODEL, submitCarModel);
}

function* submitCarVariant({ payload: { carvariant, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "vehicles/insert_variant";

    const response = yield call(postSubmitForm, url, carvariant);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadRefreshCarMakes();
      yield put(submitCarVariantSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(carsApiError(error));
  }
}
export function* watchSubmitCarVariant() {
  yield takeEvery(SUBMIT_CAR_VARIANT, submitCarVariant);
}

function* loadCars({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "cars/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadCarsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(carsApiError(error));
  }
}
export function* watchLoadCars() {
  yield takeEvery(LOAD_CARS, loadCars);
}

function* loadCarMakes({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "vehicles/get";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadCarMakesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(carsApiError(error));
  }
}
export function* watchLoadCarMakes() {
  yield takeEvery(LOAD_CAR_MAKES, loadCarMakes);
}

function* loadRefreshCars() {
  try {
    let url = process.env.REACT_APP_BASEURL + "cars/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadCarsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(carsApiError(error));
  }
}

function* loadRefreshCarMakes() {
  try {
    let url = process.env.REACT_APP_BASEURL + "vehicles/get";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadCarMakesSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(carsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(carsApiError(error));
  }
}

function* carSaga() {
  yield all([
    fork(watchSubmitCar),
    fork(watchLoadCars),
    fork(watchLoadCarMakes),
    fork(watchSubmitCarMake),
    fork(watchSubmitCarModel),
    fork(watchSubmitCarVariant),
  ]);
}

export default carSaga;
