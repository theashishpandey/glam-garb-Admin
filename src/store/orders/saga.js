import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";
// Login Redux States
import {
  SUBMIT_ORDER,
  LOAD_ORDERS,
  LOAD_ALLOTED_ORDERS,
  MARK_DELIVERED,
  MARK_PAID_SELLER,
  SUBMIT_ORDER_LIVE,
  CANCEL_ORDER_SUCCESS,
  CANCEL_ORDER,
  LOAD_ORDER_FOR_INVOICE,
  UPDATE_ORDER,
} from "./actionTypes";
import {
  submitOrderSuccess,
  loadOrdersSuccess,
  loadAllotedOrdersSuccess,
  markDeliveredSuccess,
  markPaidSellerSuccess,
  orderApiError,
  submitOrderLiveSuccess,
  cancelOrderSuccess,
  loadOrdersForInvoiceSuccess,
  updateOrderSuccess,
} from "./actions";
import { loadLiveItemSuccess, ItemApiError } from "../actions";
// For notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Include Helper Files with needed methods
import { postSubmitForm } from "../../helpers/forms_helper";
import { showNotification } from "../../helpers/notification_helper";

function* submitOrder({ payload: { order, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/insert";

    const response = yield call(postSubmitForm, url, order);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshOrders();
      yield put(submitOrderSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(orderApiError(error));
  }
}
export function* watchSubmitOrder() {
  yield takeEvery(SUBMIT_ORDER, submitOrder);
}

function* updateOrder({ payload: { order, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/update";

    const response = yield call(postSubmitForm, url, order);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield* loadrefreshOrders();
      yield put(updateOrderSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(orderApiError(error));
  }
}
export function* watchUpdateOrder() {
  yield takeEvery(UPDATE_ORDER, updateOrder);
}

function* submitOrder_fromLive({ payload: { order, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/insert";

    const response = yield call(postSubmitForm, url, order);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      const item_status = { inventory_status: "in_stock" };
      yield* loadLiveItems(item_status);
      yield put(submitOrderLiveSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response.message));
    }
  } catch (error) {
    showNotification("Something went wrong!", "Error");
    yield put(orderApiError(error));
  }
}
export function* watchSubmitOrderFromLive() {
  yield takeEvery(SUBMIT_ORDER_LIVE, submitOrder_fromLive);
}
function* loadLiveItems(item_status) {
  try {
    let url = process.env.REACT_APP_BASEURL + "items/getbystatus";
    const response = yield call(postSubmitForm, url, item_status);

    if (response.status === 1) {
      yield put(loadLiveItemSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(ItemApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(ItemApiError(error));
  }
}

//Load All Orders
function* loadOrders({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadOrdersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}
export function* watchLoadOrders() {
  yield takeEvery(LOAD_ORDERS, loadOrders);
}

//Load Orders For Invoice
function* loadOrdersForInvoice({ payload: order_details }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/forinvoice";
    const response = yield call(postSubmitForm, url, order_details);

    if (response.status === 1) {
      yield put(loadOrdersForInvoiceSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}
export function* watchLoadOrdersForInvoice() {
  yield takeEvery(LOAD_ORDER_FOR_INVOICE, loadOrdersForInvoice);
}

//Load Alloted Orders
function* loadAllotedOrders({ payload: {} }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/get_assigned_deliveries";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadAllotedOrdersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}
export function* watchLoadAllotedOrders() {
  yield takeEvery(LOAD_ALLOTED_ORDERS, loadAllotedOrders);
}

//Mark Delivered Orders
function* markDelivered({ payload: { order } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/update_delivery_status";
    const response = yield call(postSubmitForm, url, { order_id: order });

    if (response.status === 1) {
      yield put(markDeliveredSuccess(response));
      yield* reloadAllotedOrders();
      showNotification(response.message, "Success");
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}
export function* watchMarkDelivered() {
  yield takeEvery(MARK_DELIVERED, markDelivered);
}

//Mark Paid Seller Orders
function* markPaidToSeller({ payload: { order } }) {
  try {
    let url =
      process.env.REACT_APP_BASEURL + "orders/update_seller_payment_status";
    const response = yield call(postSubmitForm, url, { order_id: order });

    if (response.status === 1) {
      yield put(markPaidSellerSuccess(response));
      yield* reloadAllotedOrders();
      showNotification(response.message, "Success");
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}
export function* watchMarkPaidToSeller() {
  yield takeEvery(MARK_PAID_SELLER, markPaidToSeller);
}

//Cance Orders
function* cancelOrder({ payload: { order } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/cancel";
    const response = yield call(postSubmitForm, url, { _id: order });

    if (response.status === 1) {
      yield put(cancelOrderSuccess(response));

      showNotification(response.message, "Success");
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}
export function* watchCancelOrder() {
  yield takeEvery(CANCEL_ORDER, cancelOrder);
}

function* loadrefreshOrders() {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/getall";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadOrdersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}

function* reloadAllotedOrders() {
  try {
    let url = process.env.REACT_APP_BASEURL + "orders/get_assigned_deliveries";
    const response = yield call(postSubmitForm, url, {});

    if (response.status === 1) {
      yield put(loadAllotedOrdersSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(orderApiError(response));
    }
  } catch (error) {
    showNotification(error.message, "Error");
    yield put(orderApiError(error));
  }
}

function* orderSaga() {
  yield all([
    fork(watchSubmitOrder),
    fork(watchLoadOrders),
    fork(watchLoadAllotedOrders),
    fork(watchMarkDelivered),
    fork(watchMarkPaidToSeller),
    fork(watchSubmitOrderFromLive),
    fork(watchCancelOrder),
    fork(watchLoadOrdersForInvoice),
    fork(watchUpdateOrder),
  ]);
}

export default orderSaga;
