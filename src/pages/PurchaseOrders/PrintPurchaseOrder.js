import React, { useEffect, useState } from "react";
//i18n
import { withNamespaces } from "react-i18next";

import swal from "sweetalert2";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import PurchaseOrder from "../../components/PurchaseOrder";

import { postSubmitForm } from "../../helpers/forms_helper";

const PrintPurchaseOrder = (props) => {
  const [poData, setPOData] = useState();
  function groupBy(a, keyFunction) {
    const groups = {};
    a.forEach(function (el) {
      const key = keyFunction(el);
      if (key in groups === false) {
        groups[key] = [];
      }
      groups[key].push(el);
    });
    return groups;
  }
  const loadPOData = async (data) => {
    let url = process.env.REACT_APP_BASEURL + "purchaseorders/get_by_id";
    const response = await postSubmitForm(url, data);
    if (response && response.status === 1) {
      let arr = JSON.parse(JSON.stringify(response.data));
      let input = arr.product_details;
      const byId = groupBy(
        input.filter((it) => it._id),
        (it) => it["_id"]
      );
      console.log(byId);
      const output = Object.keys(byId).map((_id) => {
        const byName = groupBy(byId[_id], (it) => it.name);
        const byCategory = groupBy(byId[_id], (it) => it.category);

        const sum_qty = byId[_id].reduce((acc, it) => acc + Number(it.qty), 0);
        const sum_price = byId[_id].reduce(
          (acc, it) => acc + Number(it.price),
          0
        );
        const sum_total_price = byId[_id].reduce(
          (acc, it) => acc + Number(it.total_price),
          0
        );
        return {
          _id: _id,
          name: Object.keys(byName)[0],
          category: Object.keys(byCategory)[0],
          qty: sum_qty,
          price: sum_price,
          total_price: sum_total_price,
        };
      });
      arr.product_details = output;
      setPOData(arr);
    } else {
      showNotification(response.message, "Error");
    }
  };
  function showNotification(message, type) {
    if (type === "Success") swal.fire(type, message, "success");
    else swal.fire(type, message, "error");
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("po_id")) {
      loadPOData({ id: urlParams.get("po_id") });
    }
  }, []);

  return (
    <React.Fragment>
      <PurchaseOrder purchase_order={poData && poData}></PurchaseOrder>
    </React.Fragment>
  );
};
const mapStatetoProps = (state) => {};
export default withRouter(
  connect(mapStatetoProps, {})(withNamespaces()(PrintPurchaseOrder))
);
