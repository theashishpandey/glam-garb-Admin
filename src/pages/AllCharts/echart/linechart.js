import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";

class Line extends Component {
  getOption = () => {
    let data = this.props.sales_output;
    let dates = [];
    let counts = [];
    let values = [];

    //console.log (data);
    if (data) {
      data.forEach((element) => {
        dates.push(element.status_date);
        counts.push(element.count);
        values.push(element.value);
      });
    }

    return {
      tooltip: {
        trigger: "axis",
      },
      grid: {
        zlevel: 0,
        x: 50,
        x2: 50,
        y: 30,
        y2: 30,
        borderWidth: 0,
      },
      xAxis: {
        type: "category",
        //data: ["1", "2", "3", "4", "5", "6", "7"],
        data: dates,
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#74788d",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLable: {
          color: "#ffffff",
        },
        axisLine: {
          lineStyle: {
            color: "#74788d",
          },
        },
      },
      series: [
        {
          //data: [620, 832, 750, 934, 1290, 1330, 1400],
          data: counts,
          type: "line",
        },
      ],
      color: ["#556ee6"],
      textStyle: {
        color: ["#74788d"],
      },
    };
  };
  render() {
    return (
      <React.Fragment>
        <ReactEcharts style={{ height: "380px" }} option={this.getOption()} />
      </React.Fragment>
    );
  }
}
export default Line;
