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
  CANCEL_ORDER,
  CANCEL_ORDER_SUCCESS,
  LOAD_ORDER_FOR_INVOICE,
  LOAD_ORDER_FOR_INVOICE_SUCCESS,
  UPDATE_ORDER,
  UPDATE_ORDER_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
};

const orders = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_ORDER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBMIT_ORDER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "Order added successfully.",
        message_type: "Success",
      };
      break;
    case UPDATE_ORDER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case UPDATE_ORDER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: "Order updated successfully.",
        message_type: "Success",
      };
      break;

    case LOAD_ORDERS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ORDERS_SUCCESS:
      state = {
        ...state,
        loading: false,
        orders: action.payload.data,
      };
      break;

    case LOAD_ALLOTED_ORDERS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ALLOTED_ORDERS_SUCCESS:
      state = {
        ...state,
        loading: false,
        alloted_orders: action.payload.data,
      };
      break;

    case LOAD_ORDER_FOR_INVOICE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOAD_ORDER_FOR_INVOICE_SUCCESS:
      state = {
        ...state,
        loading: false,
        orders_for_invoice: action.payload.data,
      };
      break;

    case MARK_DELIVERED:
      state = {
        ...state,
        loading: true,
      };
      break;
    case MARK_DELIVERED_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case CANCEL_ORDER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case CANCEL_ORDER_SUCCESS:
      state = {
        ...state,
        loading: false,
      };
      break;

    case ORDER_API_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
        message: action.payload,
        message_type: "Error",
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default orders;
