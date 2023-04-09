import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import { SUBMIT_GIFTCARDS, LOAD_GIFTCARDS } from "./actionTypes";
import {
  submitGiftCardsSuccess,
  loadGiftCardsSuccess,
  GiftCardsApiError,
} from "./actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitGiftCards({ payload: { giftcards, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "giftcards/insert";

    const response = yield call(postSubmitForm, url, giftcards);

    if (response.status === 1) {
      showNotification("Gift card added successfully.", "Success");
      yield* loadrefreshGiftCards();
      yield put(submitGiftCardsSuccess(response));
    } else {
      console.log(response);
      showNotification(response.message, "Error");
      yield put(GiftCardsApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(GiftCardsApiError(error));
  }
}
export function* watchSubmitGiftCards() {
  yield takeEvery(SUBMIT_GIFTCARDS, submitGiftCards);
}
//Load All giftcards
function* loadGiftCards({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "giftcards/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadGiftCardsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(GiftCardsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(GiftCardsApiError(error));
  }
}
export function* watchLoadGiftCards() {
  yield takeEvery(LOAD_GIFTCARDS, loadGiftCards);
}

function* loadrefreshGiftCards() {
  try {
    let url = process.env.REACT_APP_BASEURL + "giftcards/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadGiftCardsSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(GiftCardsApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(GiftCardsApiError(error));
  }
}

function* giftcardsSaga() {
  yield all([fork(watchSubmitGiftCards), fork(watchLoadGiftCards)]);
}

export default giftcardsSaga;
