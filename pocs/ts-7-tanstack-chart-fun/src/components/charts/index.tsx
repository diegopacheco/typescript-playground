import React from 'react';
import { Chart as ChartComponent, ComposedChart, LineChart, AreaChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from '@tanstack/react-charts';
import { ChartDataPoint } from '../types';

export function MultiLineChart({ data }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickFormatter={(v) => {
              const date = v instanceof Date ? v : new Date(v);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                        <span className="text-sm font-medium">{entry.value?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="y1" name="Metric 1" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="y2" name="Metric 2" stroke="#82ca9d" strokeWidth={2} />
          <Line type="monotone" dataKey="y3" name="Metric 3" stroke="#ffc658" strokeWidth={2} />
          <Line type="monotone" dataKey="y4" name="Metric 4" stroke="#ff7300" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedAreaChart({ data }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickFormatter={(v) => {
              const date = v instanceof Date ? v : new Date(v);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                        <span className="text-sm">{entry.name}: {entry.value?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area type="monotone" dataKey="y1" name="Layer 1" stroke="#8884d8" fill="#8884d820" stackId="1" />
          <Area type="monotone" dataKey="y2" name="Layer 2" stroke="#82ca9d" fill="#82ca9d20" stackId="1" />
          <Area type="monotone" dataKey="y3" name="Layer 3" stroke="#ffc658" fill="#ffc65820" stackId="1" />
          <Area type="monotone" dataKey="y4" name="Layer 4" stroke="#ff7300" fill="#ff730020" stackId="1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChartComponent({ data }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                        <span className="text-sm">{entry.name}: {entry.value?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="y1" name="Metric 1" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="y2" name="Metric 2" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          <Bar dataKey="y3" name="Metric 3" fill="#ffc658" radius={[4, 4, 0, 0]} />
          <Bar dataKey="y4" name="Metric 4" fill="#ff7300" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({ data }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickFormatter={(v) => {
              const date = v instanceof Date ? v : new Date(v);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                        <span className="text-sm">{entry.name}: {entry.value?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="y1" name="Metric 1" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StepLineChart({ data }) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 60, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            tickFormatter={(v) => {
              const date = v instanceof Date ? v : new Date(v);
              return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
                        <span className="text-sm">{entry.name}: {entry.value?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line type="step" dataKey="y1" name="Metric 1" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
