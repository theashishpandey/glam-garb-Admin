import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import swal from "sweetalert2";

// Login Redux States
import { CHANGE_PASSWORD, LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { loginSuccess, apiError, changePasswordSuccess } from "./actions"; //logoutUserSuccess

//Include Helper Files with needed methods
import {
  postSubmitFormNoAuth,
  postSubmitForm,
} from "../../../helpers/forms_helper";

import React from "react";
import { Redirect } from "react-router-dom";

// Dashboard
import Dashboard from "../../../pages/Dashboard/index";

// Employees
import AddEmployee from "../../../pages/Employees/AddEmployee";
import AllEmployees from "../../../pages/Employees/AllEmployees";

// Customers
import AddCustomer from "../../../pages/Customers/AddCustomer";
import AllCustomers from "../../../pages/Customers/AllCustomers";

// Suppliers
import AddSupplier from "../../../pages/Suppliers/AddSupplier";
import AllSuppliers from "../../../pages/Suppliers/AllSuppliers";

// Stores
import AddStore from "../../../pages/Stores/AddStore";
import AllStores from "../../../pages/Stores/AllStores";

// Warehouses
import AddWarehouse from "../../../pages/Warehouses/AddWarehouse";
import AllWarehouses from "../../../pages/Warehouses/AllWarehouses";

// Products
import AddProduct from "../../../pages/Products/AddProduct";
import AllProducts from "../../../pages/Products/AllProducts";

// Offers
import AddOffer from "../../../pages/Offers/AddOffer";

// Coupons
import AddCoupon from "../../../pages/Coupons/AddCoupon";

// Users
import AddUser from "../../../pages/Users/AddUser";
import AllUsers from "../../../pages/Users/AllUsers";

// Purchase
import AddPurchaseOrder from "../../../pages/PurchaseOrders/AddPurchaseOrder";
import AddPurchaseOrderForOrders from "../../../pages/PurchaseOrders/AddPurchaseOrderForOrders";
import AllPurchaseOrders from "../../../pages/PurchaseOrders/AllPurchaseOrders";

// Purchase Invoices
import AddPurchaseInvoice from "../../../pages/PurchaseInvoices/AddPurchaseInvoice";
import AllPurchaseInvoices from "../../../pages/PurchaseInvoices/AllPurchaseInvoices";

//Subscribers
import AllSubscriber from "../../../pages/Subscriber/AllSubscriber";
// ChangePassword
import ChangePassword from "../../../pages/ChangePassword";

import { showNotification } from "../../../helpers/notification_helper";
import Pincodes from "../../../pages/Pincode/Pincodes";
import AllCoupons from "./../../../pages/Coupons/AllCoupons";
import AllOrders from "./../../../pages/Orders/AllOrders";
import AllComplaints from "./../../../pages/Complaints/AllComplaints";
import AddCombo from "../../../pages/Combo/AddCombo";
// import AddOfflineOrder from "../../../pages/Orders/AddOfflineOrder";
import AllCombos from "../../../pages/Combo/AllCombos";
import AllOrdersReport from "../../../pages/Reports/AllOrdersReport";
import StockReport from "../../../pages/Reports/StockReport";
import AllProductReports from "../../../pages/Reports/AllProductReports";
import AllComplaintsReports from "../../../pages/Reports/AllComplaintsReports";
import SalesPerfomanceReport from "../../../pages/Reports/SalesPerfomanceReport";
import ExpenseMemos from "./../../../pages/Reports/ExpenseMemos";
import SupplierSalesReport from "../../../pages/Reports/SupplierSalesReport";
import SupplierPurchaseReport from "../../../pages/Reports/SupplierPurchaseReport";
import ExpenseMemosReport from "../../../pages/Reports/ExpenseMemosReport";
import AddComboImage from "./../../../pages/Combo/AddComboImage";
import Settings from "../../../pages/Settings/Settings";
import AddCategory from "./../../../pages/Category/AddCategory";
import AllCategory from "../../../pages/Category/AllCategory";
import DailyIncomeReport from "../../../pages/Reports/DailyIncomeReport";
// import AllOrderByUser from "../../../pages/Orders/AllOrderByUser";
import ExpenseMemoByUser from "../../../pages/Reports/ExpenseMemoByUser";


function* loginUser({ payload: { user, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/login";

    const response = yield call(postSubmitFormNoAuth, url, user);

    if (response.status === 1) {
      let routes = [];
      const role = response.data.role;
    
        routes = [
          { path: "/dashboard", component: Dashboard },

          { path: "/add_coupon", component: AddCoupon },
          { path: "/all_coupons", component: AllCoupons },

          { path: "/add_offer", component: AddOffer },

          { path: "/add_employee", component: AddEmployee },
          { path: "/all_employees", component: AllEmployees },

          { path: "/add_user", component: AddUser },
          { path: "/all_users", component: AllUsers },

          { path: "/add_customer", component: AddCustomer },
          { path: "/all_customers", component: AllCustomers },

          { path: "/add_supplier", component: AddSupplier },
          { path: "/all_suppliers", component: AllSuppliers },

          { path: "/add_store", component: AddStore },
          { path: "/all_stores", component: AllStores },

          { path: "/add_warehouse", component: AddWarehouse },
          { path: "/all_warehouses", component: AllWarehouses },

          { path: "/add_product", component: AddProduct },
          { path: "/all_products", component: AllProducts },

          { path: "/add_purchase_order", component: AddPurchaseOrder },
          {
            path: "/add_purchase_order_for_orders",
            component: AddPurchaseOrderForOrders,
          },
          { path: "/all_purchase_order", component: AllPurchaseOrders },
          //purchase invoices
          { path: "/add_purchase_invoice", component: AddPurchaseInvoice },
          { path: "/all_purchase_invoices", component: AllPurchaseInvoices },

          { path: "/all_subscribers", component: AllSubscriber },

          { path: "/pincodes", component: Pincodes },
          //Orders
          // { path: "/add_offline_order", component: AddOfflineOrder },
          // { path: "/all_booked_orders", component: AllOrdersBooked },
          // { path: "/all_inprocess_orders", component: AllOrdersInProcess },
          // { path: "/all_dispatched_orders", component: AllOrdersDispatched },
          // { path: "/all_delivered_orders", component: AllOrdersDelivered },
          // {
          //   path: "/all_ready_to_dispatch_orders",
          //   component: AllOrdersReadyToDispatch,
          // },
          // { path: "/all_cancelled_orders", component: AllOrdersCancelled },

          //Complaints
          { path: "/all_complaints", component: AllComplaints },
          //category
          { path: "/add_category", component: AddCategory },
          { path: "/all_category", component: AllCategory },
          //Combo
          { path: "/add_combo", component: AddCombo },
          { path: "/all_combos", component: AllCombos },
          { path: "/add_combo_image", component: AddComboImage },
          //Reports
          { path: "/daily_income_report", component: DailyIncomeReport },
          { path: "/all_orders_report", component: AllOrdersReport },
          { path: "/stock_report", component: StockReport },

          { path: "/all_products_report", component: AllProductReports },
          { path: "/all_complaints_report", component: AllComplaintsReports },
          {
            path: "/sales_perfomance_report",
            component: SalesPerfomanceReport,
          },
          { path: "/supplier_sales_report", component: SupplierSalesReport },
          {
            path: "/supplier_purchase_report",
            component: SupplierPurchaseReport,
          },
          {
            path: "/all_orders",
            component: AllOrders,
          },
          { path: "/expense_memo", component: ExpenseMemos },
          {
            path: "/expense_memos_report",
            component: ExpenseMemosReport,
          },
          { path: "/settings", component: Settings },

          { path: "/change_password", component: ChangePassword },
          // this route should be at the end of all other routes
          {
            path: "/",
            exact: true,
            component: () => <Redirect to="/dashboard" />,
          },
        ];
      

      response.routes = routes;
    
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("mobile", response.data.mobile);
      localStorage.setItem("employee_id", response.data.employee_id);
     
      localStorage.setItem("userToken", response.data.token);
      yield put(loginSuccess(response));
      history.push("/dashboard");
    } else {
      yield put(apiError(response.message));
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/logout";
    const token = localStorage.getItem("userToken");
    if (token) {
      const response = yield call(postSubmitForm, url, {});
      //console.log(response);
      if (response.status === 1) {
        localStorage.clear();
        localStorage.removeItem("username");
        localStorage.removeItem("name");
        localStorage.removeItem("mobile");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("userToken");
        history.push("/login");
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* changePassword({ payload: { password_details, history } }) {
  try {
    let url = process.env.REACT_APP_BASEURL + "adminusers/changepassword";

    const response = yield call(postSubmitForm, url, password_details);

    if (response.status === 1) {
      showNotification(response.message, "Success");
      yield put(changePasswordSuccess(response));
    } else {
      showNotification(response.message, "Error");
      yield put(apiError(response.message));
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

export function* watchUserLogin() {
  yield takeEvery(LOGIN_USER, loginUser);
}

export function* watchUserLogout() {
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export function* watchChangePassword() {
  yield takeEvery(CHANGE_PASSWORD, changePassword);
}

function* authSaga() {
  yield all([
    fork(watchUserLogin),
    fork(watchUserLogout),
    fork(watchChangePassword),
  ]);
}

export default authSaga;
