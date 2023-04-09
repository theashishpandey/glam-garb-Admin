import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

// Investments
import Investments from "./investments/reducer";

// Employees
import Employees from "./employees/reducer";

// Sources
import Sources from "./sources/reducer";

// Incomes
import Incomes from "./incomes/reducer";

// Expenses
import Expenses from "./expenses/reducer";

// Cars
import Cars from "./cars/reducer";

// Sellers
import Sellers from "./sellers/reducer";

// Buyers
import Buyers from "./buyers/reducer";

// Users
import AddUser from "./users/reducer";

// Items
import Item from "./items/reducer";

// Products
import Products from "./products/reducer";

// Gift Cards
import GiftCards from "./giftcards/reducer";

// Orders
import Orders from "./orders/reducer";

// Reports
import Reports from "./reports/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  Cars,
  //Investments
  Investments,
  Employees,
  Sources,
  Incomes,
  Expenses,
  // Sellers
  Sellers,

  // Buyers
  Buyers,

  // AddUser
  AddUser,

  // items
  Item,

  // Products
  Products,

  //Gift Cards
  GiftCards,

  //Orders
  Orders,
  //Reports
  Reports,
});

export default rootReducer;
