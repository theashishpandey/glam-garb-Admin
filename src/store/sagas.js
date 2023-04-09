import { all } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";

// Investments
import InvestmentsSaga from "./investments/saga";
// Employees
import EmployeesSaga from "./employees/saga";
// Sources
import SourcesSaga from "./sources/saga";
// Incomes
import IncomesSaga from "./incomes/saga";
// Expenses
import ExpensesSaga from "./expenses/saga";
// Cars
import CarsSaga from "./cars/saga";

// Sellers
import SellerSaga from "./sellers/saga";

// Buyers
import BuyerSaga from "./buyers/saga";

// Users
import AddUserSaga from "./users/saga";

// Items
import ItemSaga from "./items/saga";

// Products
import ProductsSaga from "./products/saga";

// Gift Cards
import GiftCardsSaga from "./giftcards/saga";

// Orders
import OrdersSaga from "./orders/saga";

// Reports
import ReportsSaga from "./reports/saga";

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    AuthSaga(),

    InvestmentsSaga(),
    EmployeesSaga(),
    SourcesSaga(),
    IncomesSaga(),
    ExpensesSaga(),
    CarsSaga(),
    ProfileSaga(),
    ForgetSaga(),
    LayoutSaga(),
    SellerSaga(),
    BuyerSaga(),
    AddUserSaga(),
    ItemSaga(),
    ProductsSaga(),
    GiftCardsSaga(),
    OrdersSaga(),
    ReportsSaga(),
  ]);
}
