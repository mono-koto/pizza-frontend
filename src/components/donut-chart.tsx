"use client";

// Adapted from https://www.react-graph-gallery.com/donut

import { useMemo } from "react";
import * as d3 from "d3";
import { animated, useSpring } from "react-spring";
import { useEns } from "@/hooks/useEns";

type DataItem = {
  name: string;
  id: string;
  value?: number;
};

type DonutChartProps = {
  width: number;
  height: number;
  data: DataItem[];
};

const MARGIN_X = 150;
const MARGIN_Y = 50;

const colors = [
  "#e0ac2b",
  "#e85252",
  "#6689c6",
  "#9a6fb0",
  "#a53253",
  "#69b3a2",
];

export const DonutChart = ({ width, height, data }: DonutChartProps) => {
  // Sort by alphabetical to maximise consistency between dataset
  const sortedData = data.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

  const pie = useMemo(() => {
    const pieGenerator = d3
      .pie<any, DataItem>()
      .value((d) => d.value || 0)
      .sort(null); // Do not apply any sorting, respect the order of the provided dataset
    return pieGenerator(sortedData);
  }, [data]);

  const allPaths = pie.map((slice, i) => {
    return (
      <Slice
        key={slice.data.id}
        radius={radius}
        slice={slice}
        color={colors[i]}
      />
    );
  });

  return (
    <svg width={width} height={height} style={{ display: "inline-block" }}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>{allPaths}</g>
    </svg>
  );
};

type SliceProps = {
  color: string;
  radius: number;
  slice: d3.PieArcDatum<DataItem>;
};
const Slice = ({ slice, radius, color }: SliceProps) => {
  const arcGenerator = d3.arc();

  const ens = useEns(slice.data.name);
  console.log(slice.data.value);

  const springProps = useSpring({
    to: {
      pos: [slice.startAngle, slice.endAngle] as [number, number],
    },
  });

  const slicePath = springProps.pos.to((start, end) => {
    return arcGenerator({
      innerRadius: radius * 0.5,
      outerRadius: radius,
      startAngle: start,
      endAngle: end,
    }) as string;
  });

  const INFLEXION_PADDING = 20; // space between donut and label inflexion point

  const centroid = springProps.pos.to((start, end) =>
    arcGenerator.centroid({
      innerRadius: radius * 0.5,
      outerRadius: radius,
      startAngle: start,
      endAngle: end,
    })
  );

  // Second arc is for the legend inflexion point
  const inflexionPoint = springProps.pos.to((start, end) =>
    arcGenerator.centroid({
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: start,
      endAngle: end,
    })
  );

  const label =
    (ens.data.name || ens.data.address) + " (" + slice.data.value + ")";

  return (
    <>
      <g>
        <animated.path d={slicePath} fill={colors[slice.index]} />
        {slice.data.name?.length && (
          <g>
            <animated.circle
              cx={centroid.to((x) => x)}
              cy={centroid.to((_, y) => y)}
              r={2}
            />
            <animated.line
              x1={centroid.to((x) => x)}
              y1={centroid.to((_, y) => y)}
              x2={inflexionPoint.to((x) => x)}
              y2={inflexionPoint.to((_, y) => y)}
              stroke={"black"}
              fill={"black"}
            />
            <animated.line
              x1={inflexionPoint.to((x) => x)}
              y1={inflexionPoint.to((_, y) => y)}
              x2={inflexionPoint.to((x) => (x > 0 ? x + 50 : x - 50))}
              y2={inflexionPoint.to((_, y) => y)}
              stroke={"black"}
              fill={"black"}
            />
            <animated.text
              x={inflexionPoint.to((x) => (x > 0 ? x + 52 : x - 52))}
              y={inflexionPoint.to((_, y) => y)}
              textAnchor={inflexionPoint.to((x) => (x > 0 ? "start" : "end"))}
              dominantBaseline='middle'
              fontSize={14}
            >
              {label}
            </animated.text>
          </g>
        )}
      </g>
    </>
  );
};
