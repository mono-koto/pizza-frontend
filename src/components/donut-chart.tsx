"use client";

// Adapted from https://www.react-graph-gallery.com/donut

import { useMemo } from "react";
import * as d3 from "d3";
import { animated, useSpring } from "react-spring";
import { useEns } from "@/hooks/useEns";

type DataItem = {
  name: string | undefined;
  id: string;
  value?: number;
};

interface DonutChartProps extends React.HTMLProps<HTMLDivElement> {
  colors: string[];
  width: number;
  height: number;
  dataset: DataItem[];
  labelColor?: string;
}

const MARGIN_X = 100;
const MARGIN_Y = 30;

export const DonutChart = ({
  width,
  height,
  dataset,
  colors,
  labelColor,
  ...remainingProps
}: DonutChartProps) => {
  // Sort by alphabetical to maximise consistency between dataset
  const sortedData = dataset.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

  const pie = useMemo(() => {
    const pieGenerator = d3
      .pie<any, DataItem>()
      .value((d) => d.value || 0)
      .sort(null); // Do not apply any sorting, respect the order of the provided dataset
    return pieGenerator(sortedData);
  }, [dataset]);
  const total = pie.reduce((acc, curr) => acc + (curr.data.value || 0), 0);

  const allPaths = pie.map((slice, i) => {
    return (
      <Slice
        labelColor={labelColor || "#000"}
        key={slice.data.id}
        radius={radius}
        slice={slice}
        total={total}
        color={colors[i]}
      />
    );
  });

  return (
    <div {...remainingProps}>
      <svg width={width} height={height} style={{ display: "inline-block" }}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>{allPaths}</g>
      </svg>
    </div>
  );
};

type SliceProps = {
  color: string;
  radius: number;
  slice: d3.PieArcDatum<DataItem>;
  total: number;
  labelColor: string;
};
const Slice = ({ slice, radius, color, total, labelColor }: SliceProps) => {
  const arcGenerator = d3.arc();

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

  const percentage = `${
    Math.round((10000 * (slice.data.value || 0)) / total) / 100
  }%`;

  const label = slice.data.name + " (" + percentage + ")";

  return (
    <g>
      <animated.path d={slicePath} fill={color} />

      <g>
        <animated.circle
          fill={labelColor}
          cx={centroid.to((x) => x)}
          cy={centroid.to((_, y) => y)}
          r={2}
        />
        <animated.line
          x1={centroid.to((x) => x)}
          y1={centroid.to((_, y) => y)}
          x2={inflexionPoint.to((x) => x)}
          y2={inflexionPoint.to((_, y) => y)}
          stroke={labelColor}
          // fill={"black"}
        />
        <animated.line
          x1={inflexionPoint.to((x) => x)}
          y1={inflexionPoint.to((_, y) => y)}
          x2={inflexionPoint.to((x) => (x > 0 ? x + 50 : x - 50))}
          y2={inflexionPoint.to((_, y) => y)}
          stroke={labelColor}
          fill={"black"}
        />
        <animated.text
          x={inflexionPoint.to((x) => (x > 0 ? x + 52 : x - 52))}
          y={inflexionPoint.to((_, y) => y)}
          width={10}
          textAnchor={inflexionPoint.to((x) => (x > 0 ? "start" : "end"))}
          dominantBaseline='middle'
          className='text-xs'
          fill={labelColor}
        >
          {label}
        </animated.text>
      </g>
    </g>
  );
};
