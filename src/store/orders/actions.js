import {
  SUBMIT_ORDER,
  SUBMIT_ORDER_SUCCESS,
  ORDER_API_ERROR,
  LOAD_ORDERS,
  LOAD_ORDERS_SUCCESS,
  LOAD_ALLOTED_ORDERS,
  LOAD_ALLOTED_ORDERS_SUCCESS,
  MARK_DELIVERED,
  MARK_DELIVERED_SUCCESS,
  MARK_PAID_SELLER,
  MARK_PAID_SELLER_SUCCESS,
  SUBMIT_ORDER_LIVE,
  SUBMIT_ORDER_LIVE_SUCCESS,
  CANCEL_ORDER,
  CANCEL_ORDER_SUCCESS,
  LOAD_ORDER_FOR_INVOICE,
  LOAD_ORDER_FOR_INVOICE_SUCCESS,
  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
} from "./actionTypes";

export const submitOrder = (order, history) => {
  return {
    type: SUBMIT_ORDER,
    payload: { order, history },
  };
};

export const submitOrderSuccess = (order) => {
  return {
    type: SUBMIT_ORDER_SUCCESS,
    payload: order,
  };
};

export const updateOrder = (order, history) => {
  return {
    type: UPDATE_ORDER,
    payload: { order, history },
  };
};

export const updateOrderSuccess = (order) => {
  return {
    type: UPDATE_ORDER_SUCCESS,
    payload: order,
  };
};

export const submitOrderLive = (order, history) => {
  return {
    type: SUBMIT_ORDER_LIVE,
    payload: { order, history },
  };
};

export const submitOrderLiveSuccess = (order) => {
  return {
    type: SUBMIT_ORDER_LIVE_SUCCESS,
    payload: order,
  };
};

export const loadOrders = () => {
  return {
    type: LOAD_ORDERS,
    payload: {},
  };
};

export const loadOrdersSuccess = (orders) => {
  return {
    type: LOAD_ORDERS_SUCCESS,
    payload: orders,
  };
};

export const loadAllotedOrders = () => {
  return {
    type: LOAD_ALLOTED_ORDERS,
    payload: {},
  };
};

export const loadAllotedOrdersSuccess = (orders) => {
  return {
    type: LOAD_ALLOTED_ORDERS_SUCCESS,
    payload: orders,
  };
};

export const loadOrdersForInvoice = (order) => {
  return {
    type: LOAD_ORDER_FOR_INVOICE,
    payload: order,
  };
};

export const loadOrdersForInvoiceSuccess = (orders) => {
  return {
    type: LOAD_ORDER_FOR_INVOICE_SUCCESS,
    payload: orders,
  };
};

export const markDelivered = (order) => {
  return {
    type: MARK_DELIVERED,
    payload: { order },
  };
};

export const markDeliveredSuccess = (orders) => {
  return {
    type: MARK_DELIVERED_SUCCESS,
    payload: orders,
  };
};

export const cancelOrder = (order) => {
  return {
    type: CANCEL_ORDER,
    payload: { order },
  };
};

export const cancelOrderSuccess = (orders) => {
  return {
    type: CANCEL_ORDER_SUCCESS,
    payload: orders,
  };
};

export const markPaidSeller = (order) => {
  return {
    type: MARK_PAID_SELLER,
    payload: { order },
  };
};

export const markPaidSellerSuccess = (orders) => {
  return {
    type: MARK_PAID_SELLER_SUCCESS,
    payload: orders,
  };
};

export const orderApiError = (error) => {
  return {
    type: ORDER_API_ERROR,
    payload: error,
  };
};
