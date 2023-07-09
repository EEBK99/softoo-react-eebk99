"use client";

import React, { FC } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

interface Props {
  apiData: any;
}

export const ChartContent: FC<Props> = ({ apiData }) => {
  console.log("API data : ", apiData);

  echarts.registerTheme("theme", {
    backgroundColor: "#252531",
  });

  const generateMockData = () => {
    const data: any = [];
    const dataCount = 10;
    const startTime = +new Date();
    const categories = ["categoryA", "categoryB", "categoryC"];
    const types = [
      { name: "JS Heap", color: "#7b9ce1" },
      { name: "Documents", color: "#bd6d6c" },
      { name: "Nodes", color: "#75d874" },
      { name: "Listeners", color: "#e0bc78" },
      { name: "GPU Memory", color: "#dc77dc" },
      { name: "GPU", color: "#72b362" },
    ];

    categories.forEach(function (category, index) {
      var baseTime = startTime;
      for (var i = 0; i < dataCount; i++) {
        var typeItem = types[Math.round(Math.random() * (types.length - 1))];
        var duration = Math.round(Math.random() * 10000);
        data.push({
          name: typeItem.name,
          value: [index, baseTime, (baseTime += duration), duration],
          itemStyle: {
            normal: {
              color: typeItem.color,
            },
          },
        });
        baseTime += Math.round(Math.random() * 2000);
      }
    });

    return data;
  };

  const renderChart = () => {
    const data = generateMockData();

    const option = {
      tooltip: {
        formatter: function (params: {
          marker: any;
          name: any;
          value: string[];
        }) {
          return params.marker + params.name + ": " + params.value[3] + " ms";
        },
      },
      title: {
        text: "Electrical Power Supply Chart",
        left: "center",
      },
      dataZoom: [
        {
          type: "slider",
          filterMode: "weakFilter",
          showDataShadow: false,
          top: 400,
          labelFormatter: "",
        },
        {
          type: "inside",
          filterMode: "weakFilter",
        },
      ],
      grid: {
        height: 300,
      },
      xAxis: {
        min: +new Date(),
        scale: true,
        axisLabel: {
          formatter: function (val: number) {
            return Math.max(0, val - +new Date()) + " ms";
          },
        },
      },
      yAxis: {
        data: ["categoryA", "categoryB", "categoryC"],
      },
      series: [
        {
          type: "custom",
          renderItem: function (
            params: { coordSys: { x: any; y: any; width: any; height: any } },
            api: {
              value: (arg0: number) => any;
              coord: (arg0: any[]) => any;
              size: (arg0: number[]) => number[];
              style: () => any;
            }
          ) {
            var categoryIndex = api.value(0);
            var start = api.coord([api.value(1), categoryIndex]);
            var end = api.coord([api.value(2), categoryIndex]);
            var height = api.size([0, 1])[1] * 0.6;
            var rectShape = echarts.graphic.clipRectByRect(
              {
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height,
              },
              {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height,
              }
            );
            return (
              rectShape && {
                type: "rect",
                transition: ["shape"],
                shape: rectShape,
                style: api.style(),
              }
            );
          },
          itemStyle: {
            opacity: 0.8,
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: data,
        },
      ],
    };

    return (
      <ReactECharts
        option={option}
        style={{ height: "500px" }}
        theme={"theme"}
      />
    );
  };

  return <>{renderChart()}</>;
};
