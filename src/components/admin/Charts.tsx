"use client";

import React, { useState } from "react";

export interface DataPoint {
  label: string;
  value: number;
  subValue?: string | number;
}

interface AreaChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  color?: string; // e.g. "blue" | "emerald" | "amber" | "indigo"
  valuePrefix?: string;
  valueSuffix?: string;
}

export function AreaChart({
  data,
  title,
  height = 200,
  color = "blue",
  valuePrefix = "",
  valueSuffix = "",
}: AreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-zinc-400">
        No telemetry data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 1);
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 30;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  // Calculate points
  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * plotWidth;
    const y = height - paddingY - (d.value / maxValue) * plotHeight;
    return { x, y, ...d };
  });

  // Construct smooth SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const colorMap: Record<string, { stroke: string; fill: string; stopColor: string }> = {
    blue: { stroke: "#2563EB", fill: "url(#blueGrad)", stopColor: "#3B82F6" },
    emerald: { stroke: "#059669", fill: "url(#emeraldGrad)", stopColor: "#10B981" },
    amber: { stroke: "#D97706", fill: "url(#amberGrad)", stopColor: "#F59E0B" },
    indigo: { stroke: "#4F46E5", fill: "url(#indigoGrad)", stopColor: "#6366F1" },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="w-full relative">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{title}</span>
          {hoveredIdx !== null && (
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
              {data[hoveredIdx].label}: {valuePrefix}
              {data[hoveredIdx].value.toLocaleString()}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id={`${color}Grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={scheme.stopColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={scheme.stopColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = height - paddingY - pct * plotHeight;
          const val = Math.round(pct * maxValue);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800/80"
                strokeDasharray="3 3"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={fillD} fill={scheme.fill} />

        {/* Curve line */}
        <path
          d={pathD}
          fill="none"
          stroke={scheme.stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & interaction hits */}
        {points.map((p, i) => (
          <g
            key={i}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? "5" : "3.5"}
              fill="#FFFFFF"
              stroke={scheme.stroke}
              strokeWidth={hoveredIdx === i ? "3" : "2"}
              className="transition-all"
            />
            {/* Transparent hover hit target */}
            <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

            {/* X Axis Labels */}
            <text
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="text-[9px] fill-zinc-400 font-medium"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

interface BarChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  barColor?: string; // "blue" | "emerald" | "amber"
  valuePrefix?: string;
  valueSuffix?: string;
}

export function BarChart({
  data,
  title,
  height = 180,
  barColor = "blue",
  valuePrefix = "",
  valueSuffix = "",
}: BarChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-zinc-400">
        No bar chart data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 1);
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const barWidth = Math.max(8, Math.min(36, plotWidth / data.length - 8));

  const colors: Record<string, string> = {
    blue: "fill-blue-600 hover:fill-blue-500",
    emerald: "fill-emerald-600 hover:fill-emerald-500",
    amber: "fill-amber-500 hover:fill-amber-400",
    indigo: "fill-indigo-600 hover:fill-indigo-500",
  };
  const activeClass = colors[barColor] || colors.blue;

  return (
    <div className="w-full relative">
      {title && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{title}</span>
          {hoveredIdx !== null && (
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-full">
              {data[hoveredIdx].label}: {valuePrefix}
              {data[hoveredIdx].value.toLocaleString()}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${chartWidth} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        {/* Horizontal gridlines */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = height - paddingY - pct * plotHeight;
          const val = Math.round(pct * maxValue);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800/80"
                strokeDasharray="2 2"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * plotHeight;
          const x =
            paddingX +
            (i + 0.5) * (plotWidth / data.length) -
            barWidth / 2;
          const y = height - paddingY - barHeight;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Background slot */}
              <rect
                x={x}
                y={height - paddingY - plotHeight}
                width={barWidth}
                height={plotHeight}
                className="fill-zinc-50 dark:fill-zinc-800/30 rounded"
                rx="4"
              />
              {/* Value Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx="4"
                className={`${activeClass} transition-colors`}
              />
              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className="text-[9px] fill-zinc-400 font-medium truncate"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
