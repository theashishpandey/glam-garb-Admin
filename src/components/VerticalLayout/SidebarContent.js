import React, { useEffect } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from "react-i18next";

const SidebarContent = (props) => {
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    var pathName = props.location.pathname;
    console.log(pathName);
    const initMenu = () => {
      new MetisMenu("#side-menu");
      var matchingMenuItem = null;
      var ul = document.getElementById("side-menu");
      var items = ul.getElementsByTagName("a");
      for (var i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-active"); // li
              parent5.childNodes[0].classList.add("mm-active"); //a
            }
          }
        }
      }
      return false;
    }
    return false;
  }
  const role = localStorage.getItem("role");

  return (
    <React.Fragment>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{props.t("Menu")} </li>
          <li>
            <Link to="dashboard" className=" waves-effect">
              <i className="bx bx-home-circle"></i>
              <span>{props.t("Dashboard")}</span>
            </Link>
          </li>

          
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bxs-book"></i>
                <span>{props.t("Products")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="add_product">{props.t("Add Product")}</Link>
                </li>
                <li>
                  <Link to="all_products">{props.t("All Products")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bxs-book"></i>
                <span>{props.t("Orders")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                
                <li>
                  <Link to="all_orders">{props.t("All Orders")}</Link>
                </li>
              </ul>
            </li>

          
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bxs-book"></i>
                <span>{props.t("Customers")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to="add_customer">{props.t("Add Customer")}</Link>
                </li>
                <li>
                  <Link to="all_customers">{props.t("All Customers")}</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="bx bxs-book"></i>
                <span>{props.t("Master Data")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
               <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Category")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to="add_category">{props.t("Add Category")} </Link>
                    </li>
                    <li>
                      <Link to="all_category">{props.t("All Category")} </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Employees")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to="add_employee">{props.t("Add Employee")} </Link>
                    </li>
                    <li>
                      <Link to="all_employees">
                        {props.t("All Employees")}{" "}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Users")}
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to="add_user">{props.t("Add User")} </Link>
                    </li>
                    <li>
                      <Link to="all_users">{props.t("All Users")} </Link>
                    </li>
                  </ul>
                </li>

              </ul>
            </li>
         
            
          
        </ul>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withNamespaces()(SidebarContent));
