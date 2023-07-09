"use client";

import React, { FC } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

interface Props {
  apiData: any;
}

const getLast7Days = (data: any[]) => {
  const uniqueDates = [...new Set(data.map((item) => item.date))].sort();
  console.log("uniqueDates", uniqueDates);

  return uniqueDates;
};

const getLast7DaysData = (data: any[]) => {
  const currentDate = new Date();
  const lastWeekDate = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= lastWeekDate && itemDate <= currentDate;
  });

  console.log("last 7 days", filteredData);

  return filteredData;
};

export const ChartContent: FC<Props> = ({ apiData }) => {
  console.log("API data : ", apiData);
  const filteredData = getLast7DaysData(apiData.data);
  const last7Days = getLast7Days(filteredData);

  echarts.registerTheme("theme", {
    backgroundColor: "#252531",
  });

  const generateMockData = () => {
    const data: any = [];
    const dataCount = 10;
    const startTime = +new Date();
    const categories = last7Days;
    const types =
      // [
      //   { name: "JS Heap", color: "#7b9ce1" },
      //   { name: "Documents", color: "#bd6d6c" },
      //   { name: "Nodes", color: "#75d874" },
      //   { name: "Listeners", color: "#e0bc78" },
      //   { name: "GPU Memory", color: "#dc77dc" },
      //   { name: "GPU", color: "#72b362" },
      // ];
      [
        { name: "Main", color: "#B798F5" },
        { name: "Solar", color: "#02E10C" },
        { name: "DG", color: "#403F3D" },
        { name: "Battery", color: "#FDE602" },
        { name: "Solar+Battery", color: "#86B0FF" },
        { name: "Battery+Solar", color: "#86B0FF" },
        { name: "Main+Solar", color: "#7243D0" },
        { name: "Main+Battery", color: "#32864B" },
        { name: "Main+Solar+Battery", color: "#8BC486" },
        { name: "DG+Battery", color: "magenta" },
        { name: "DG+Solar+Battery", color: "cyan" },
        { name: "DG+Battery+Solar", color: "cyan" },
        { name: "Undetermined", color: "#BBE3FD" },
        { name: "", color: "white" },
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
            color: typeItem.color,
          },
        });
        console.log("created data: ", data);
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
        text: "Power Source Chart",
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
        data: last7Days,
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
