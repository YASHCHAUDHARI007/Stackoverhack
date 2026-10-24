"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MOCK_SEVERITY_DISTRIBUTION } from "@/mock/data";

interface SeverityDistributionChartProps {
  data?: typeof MOCK_SEVERITY_DISTRIBUTION;
}

const MONOCHROME_SCALE = [
  "#F0EEE8", // Warm ivory
  "#C5C7C1", // Muted silver
  "#A8AAA5", // Secondary neutral
  "#777A76", // Subtle neutral
];

export function SeverityDistributionChart({
  data = MOCK_SEVERITY_DISTRIBUTION,
}: SeverityDistributionChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="surface-solid rounded-2xl p-6 h-[290px] flex items-center justify-center font-mono text-xs text-[#777A76]">
        Loading failure taxonomy...
      </div>
    );
  }

  return (
    <div className="surface-solid rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
      <div className="pb-3.5 border-b border-[rgba(226,226,218,0.13)]">
        <div className="text-[11px] font-mono text-[#777A76] tracking-wider uppercase font-medium">
          Root cause classification
        </div>
        <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight mt-0.5">
          Failure mechanism taxonomy
        </h3>
        <p className="text-xs text-[#A8AAA5] mt-0.5">
          Breakdown of isolated root-cause failure vectors
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3 mt-4">
        {/* Pie Canvas */}
        <div className="h-[150px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={58}
                paddingAngle={4}
                dataKey="value"
                stroke="#17191A"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={MONOCHROME_SCALE[index % MONOCHROME_SCALE.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="p-3 rounded-xl bg-[#222424] border border-[rgba(235,235,228,0.16)] shadow-2xl font-mono text-xs">
                        <div className="text-[#F0EEE8] font-semibold">{item.name}</div>
                        <div className="text-[#A8AAA5] mt-0.5 font-medium">
                          {item.value}% ({item.count} tests)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="space-y-2 font-mono text-xs">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#222424]/40 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      MONOCHROME_SCALE[idx % MONOCHROME_SCALE.length],
                  }}
                />
                <span className="text-[#A8AAA5] truncate max-w-[120px] text-[11px]">
                  {item.name}
                </span>
              </div>
              <span className="text-[#F0EEE8] font-medium text-[11px]">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
