"use client";

import React, { FC } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import moment from "moment";

interface Props {
  apiData: any;
}

const getLast7Days = (data: any[]) => {
  // Get unique dates from the data and sort them
  const uniqueDates = [...new Set(data.map((item) => item.date))].sort();
  return uniqueDates;
};

const getLast7DaysData = (data: any[]) => {
  const currentDate = new Date();
  const lastWeekDate = new Date(
    currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );
  // Filter data for the last 7 days
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= lastWeekDate && itemDate <= currentDate;
  });
  return filteredData;
};

export const ChartContent: FC<Props> = ({ apiData }) => {
  // Register a custom theme for the chart
  echarts.registerTheme("theme", {
    backgroundColor: "#252531",
  });

  // Get filtered data for the last 7 days
  const filteredData = getLast7DaysData(apiData.data);

  // Get the last 7 days as an array of dates
  const last7Days = getLast7Days(filteredData);

  // Generate structured data for the chart
  const generateChartData = () => {
    let index = 0;
    let startTime, endTime;

    const structuredData: any = [];
    const colorMap: any = {
      Main: "#B798F5",
      Solar: "#02E10C",
      DG: "#403F3D",
      Battery: "#FDE602",
      "Solar+Battery": "#86B0FF",
      "Battery+Solar": "#86B0FF",
      "Main+Solar": "#7243D0",
      "Main+Battery": "#32864B",
      "Main+Solar+Battery": "#8BC486",
      "DG+Battery": "magenta",
      "DG+Solar+Battery": "cyan",
      "DG+Battery+Solar": "cyan",
      Undetermined: "#BBE3FD",
      "": "white",
    };

    filteredData.forEach((data) => {
      const { date, sourceTag, minute_window } = data;

      if (date !== last7Days[index]) {
        index++;
      }

      startTime = moment(minute_window, "YYYY-MM-DD HH:mm").valueOf();
      endTime = moment(minute_window, "YYYY-MM-DD HH:mm")
        .add(5, "minutes")
        .valueOf();

      structuredData.push({
        name: sourceTag,
        value: [index, startTime, endTime, 300000, minute_window],
        itemStyle: {
          color: colorMap[sourceTag],
        },
      });
    });

    return structuredData;
  };

  const renderChart = () => {
    const data = generateChartData();

    const option = {
      tooltip: {
        formatter: function (params: {
          marker: any;
          name: any;
          value: string[];
        }) {
          return (
            params.marker +
            params.name +
            ": " +
            moment(params.value[4]).format("YYYY-MM-DD HH:mm")
          );
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
        type: "time",
        axisLabel: {
          formatter: function (value: number) {
            return moment(value).format("HH:mm");
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
