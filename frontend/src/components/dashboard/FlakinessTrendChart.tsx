"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MOCK_TREND_DATA } from "@/mock/data";

interface FlakinessTrendChartProps {
  data?: typeof MOCK_TREND_DATA;
}

export function FlakinessTrendChart({
  data = MOCK_TREND_DATA,
}: FlakinessTrendChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="rounded-2xl surface-solid p-6 h-[290px] flex items-center justify-center font-mono text-xs text-[#777A76]">
        Loading flakiness trajectory...
      </div>
    );
  }

  return (
    <div className="surface-solid rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] gap-2">
        <div>
          <div className="text-[11px] font-mono text-[#777A76] tracking-wider uppercase font-medium">
            Trend analysis
          </div>
          <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight mt-0.5">
            Flakiness trajectory
          </h3>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Historical flaky test recurrence vs empirically verified resolutions
          </p>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E47777]" />
            <span className="text-[#A8AAA5]">Active flakes</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7EB49A]" />
            <span className="text-[#A8AAA5]">Verified clean</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[210px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorFlaky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E47777" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#E47777" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7EB49A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7EB49A" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 2"
              stroke="rgba(226, 226, 218, 0.06)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#777A76"
              fontSize={11}
              fontFamily="var(--font-jetbrains-mono)"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#777A76"
              fontSize={11}
              fontFamily="var(--font-jetbrains-mono)"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 rounded-xl bg-[#222424] border border-[rgba(235,235,228,0.16)] shadow-2xl font-mono text-xs space-y-1.5">
                      <div className="text-[#F0EEE8] font-semibold border-b border-[rgba(226,226,218,0.13)] pb-1">
                        {label}
                      </div>
                      <div className="flex items-center justify-between space-x-4 text-[#E47777]">
                        <span>Flaky tests:</span>
                        <span className="font-bold">{payload[0]?.value}</span>
                      </div>
                      {payload[1] && (
                        <div className="flex items-center justify-between space-x-4 text-[#7EB49A]">
                          <span>Verified fixes:</span>
                          <span className="font-bold">{payload[1]?.value}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="flakyCount"
              stroke="#E47777"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorFlaky)"
              name="Flaky Tests"
            />
            <Area
              type="monotone"
              dataKey="verifiedCount"
              stroke="#7EB49A"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorVerified)"
              name="Verified Clean"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
