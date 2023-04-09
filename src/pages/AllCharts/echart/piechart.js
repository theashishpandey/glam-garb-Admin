import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
//i18n
import { withNamespaces } from "react-i18next";

class Pie extends Component {
  getOption = () => {
    let data = this.props.sales_output;
    let chartdata = [
      { value: 0, name: this.props.t("Booked") },
      { value: 0, name: this.props.t("Sold") },
      // { value: 0, name: this.props.t("Delivered") },
      { value: 0, name: this.props.t("Cancelled") },
    ];
    if (data) {
      chartdata = [
        { name: this.props.t("Booked"), value: data.booked },
        { name: this.props.t("Sold"), value: data.sold },
        // { name: "Delivered", value: data.delivered },
        { name: this.props.t("Cancelled"), value: data.cancelled },
      ];
    }
    return {
      toolbox: {
        show: false,
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: [
          this.props.t("Booked"),
          this.props.t("Sold"),
          this.props.t("Cancelled"),
        ],
        textStyle: {
          color: ["#74788d"],
        },
      },
      color: ["#f8b425", "#3c4ccf", "#ec4561"],
      series: [
        {
          name: this.props.t("Total orders"),
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: chartdata,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  };
  render() {
    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "400px" }} option={this.getOption()} />
      </React.Fragment>
    );
  }
}
export default withNamespaces()(Pie);
