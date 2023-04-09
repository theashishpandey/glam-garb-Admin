import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Employees
import AddEmployee from "../pages/Employees/AddEmployee";
import AllEmployees from "../pages/Employees/AllEmployees";

// Customers
import AddCustomer from "../pages/Customers/AddCustomer";
import AllCustomers from "../pages/Customers/AllCustomers";

// Suppliers
import AddSupplier from "../pages/Suppliers/AddSupplier";
import AllSuppliers from "../pages/Suppliers/AllSuppliers";

// Stores
import AddStore from "../pages/Stores/AddStore";
import AllStores from "../pages/Stores/AllStores";

// Warehouses
import AddWarehouse from "../pages/Warehouses/AddWarehouse";
import AllWarehouses from "../pages/Warehouses/AllWarehouses";

// Products
import AddProduct from "../pages/Products/AddProduct";
import AllProducts from "../pages/Products/AllProducts";

// Users
import AddUser from "../pages/Users/AddUser";
import AllUsers from "../pages/Users/AllUsers";

// Purchase Orders
import AddPurchaseOrder from "../pages/PurchaseOrders/AddPurchaseOrder";
import AddPurchaseOrderForOrders from "../pages/PurchaseOrders/AddPurchaseOrderForOrders";
import AllPurchaseOrders from "../pages/PurchaseOrders/AllPurchaseOrders";
import PrintPurchaseOrder from "../pages/PurchaseOrders/PrintPurchaseOrder";

// Purchase Invoices
import AddPurchaseInvoice from "../pages/PurchaseInvoices/AddPurchaseInvoice";
import AllPurchaseInvoices from "../pages/PurchaseInvoices/AllPurchaseInvoices";

//Subscribers
import AllSubscriber from "../pages/Subscriber/AllSubscriber";

//Pincodes
import Pincodes from "../pages/Pincode/Pincodes";

// ChangePassword
import ChangePassword from "../pages/ChangePassword";
import AddCoupon from "../pages/Coupons/AddCoupon";
import AddOffer from "../pages/Offers/AddOffer";
import AllOffers from "../pages/Offers/AllOffers";
import AllCoupons from "./../pages/Coupons/AllCoupons";
import AllOrders from "./../pages/Orders/AllOrders";
import AllComplaints from "./../pages/Complaints/AllComplaints";
import AddCombo from "../pages/Combo/AddCombo";
// import AddOfflineOrder from "../pages/Orders/AddOfflineOrder";
import AllCombos from "./../pages/Combo/AllCombos";
// import PrintAllOrders from "../pages/Orders/PrintAllOrders";
import AllOrdersReport from "../pages/Reports/AllOrdersReport";
import StockReport from "../pages/Reports/StockReport";
import AllProductReports from "../pages/Reports/AllProductReports";
import AllComplaintsReports from "../pages/Reports/AllComplaintsReports";
import SalesPerfomanceReport from "../pages/Reports/SalesPerfomanceReport";
import ExpenseMemos from "../pages/Reports/ExpenseMemos";
import SupplierSalesReport from "./../pages/Reports/SupplierSalesReport";
import SupplierPurchaseReport from "../pages/Reports/SupplierPurchaseReport";
import ExpenseMemosReport from "../pages/Reports/ExpenseMemosReport";
import AddComboImage from "./../pages/Combo/AddComboImage";
import Settings from "../pages/Settings/Settings";
import AddCategory from "./../pages/Category/AddCategory";
import AllCategory from "../pages/Category/AllCategory";
import DailyIncomeReport from "../pages/Reports/DailyIncomeReport";
// import AllOrderByUser from "../pages/Orders/AllOrderByUser";
import ExpenseMemoByUser from "../pages/Reports/ExpenseMemoByUser";





const role = localStorage.getItem("role");

let routes = [];

  routes = [
    { path: "/dashboard", component: Dashboard },

    { path: "/add_employee", component: AddEmployee },
    { path: "/all_employees", component: AllEmployees },

    { path: "/add_user", component: AddUser },
    { path: "/all_users", component: AllUsers },

    { path: "/add_customer", component: AddCustomer },
    { path: "/all_customers", component: AllCustomers },
    //Orders
    // { path: "/add_offline_order", component: AddOfflineOrder },
    // { path: "/all_booked_orders", component: AllOrdersBooked },
    // { path: "/all_inprocess_orders", component: AllOrdersInProcess },
    // { path: "/all_dispatched_orders", component: AllOrdersDispatched },
    // { path: "/all_delivered_orders", component: AllOrdersDelivered },

    //Complaints
    { path: "/all_complaints", component: AllComplaints },
    //category
    { path: "/add_category", component: AddCategory },
    { path: "/all_category", component: AllCategory },
    //Combo
    { path: "/add_combo", component: AddCombo },
    { path: "/all_combos", component: AllCombos },
    { path: "/add_combo_image", component: AddComboImage },
    //Coupons
    { path: "/add_coupon", component: AddCoupon },
    { path: "/all_coupons", component: AllCoupons },

    //Offers
    { path: "/add_offer", component: AddOffer },
    { path: "/all_offers", component: AllOffers },

    { path: "/add_supplier", component: AddSupplier },
    { path: "/all_suppliers", component: AllSuppliers },

    { path: "/add_store", component: AddStore },
    { path: "/all_stores", component: AllStores },

    { path: "/add_warehouse", component: AddWarehouse },
    { path: "/all_warehouses", component: AllWarehouses },

    { path: "/add_product", component: AddProduct },
    { path: "/all_products", component: AllProducts },

    //purchase orders
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
    //Reports
    {
      path: "/all_orders_report",
      component: AllOrdersReport,
    },
    {
      path: "/all_orders",
      component: AllOrders,
    },
    {
      path: "/stock_report",
      component: StockReport,
    },

    { path: "/daily_income_report", component: DailyIncomeReport },
    { path: "/all_products_report", component: AllProductReports },
    { path: "/all_complaints_report", component: AllComplaintsReports },
    { path: "/sales_perfomance_report", component: SalesPerfomanceReport },
    { path: "/supplier_sales_report", component: SupplierSalesReport },
    { path: "/supplier_purchase_report", component: SupplierPurchaseReport },
    { path: "/expense_memos_report", component: ExpenseMemosReport },

    { path: "/expense_memo", component: ExpenseMemos },
    { path: "/settings", component: Settings },

    { path: "/change_password", component: ChangePassword },
    // this route should be at the end of all other routes
    { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
  ];

const userRoutes = routes;

const authRoutes = [
  { path: "/print_purchase_order", component: PrintPurchaseOrder },
  // { path: "/print_order", component: PrintAllOrders },
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
];

export { userRoutes, authRoutes };
