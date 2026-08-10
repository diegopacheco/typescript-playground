import React, { useMemo } from 'react';
import { Chart, AxisOptions } from 'react-charts';

type MyDatum = {
  date: Date;
  value: number;
};

type Series = {
  label: string;
  data: MyDatum[];
};

function mapData(data: any[], keys: string[], labels: string[]): Series[] {
  return keys.map((key, i) => ({
    label: labels[i] || `Metric ${i + 1}`,
    data: data.map(d => ({
      date: d.x instanceof Date ? d.x : new Date(d.x),
      value: Number(d[key] || 0)
    }))
  }));
}

export function MultiLineChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => mapData(data, ['y1', 'y2', 'y3', 'y4'], ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4']), [data]);
  
  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: datum => datum.value,
        elementType: 'line',
      },
    ],
    []
  );

  return (
    <div className="chart-container">
      <Chart options={{ data: chartData, primaryAxis, secondaryAxes, dark: false }} />
    </div>
  );
}

export function StackedAreaChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => mapData(data, ['y1', 'y2', 'y3', 'y4'], ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4']), [data]);

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: datum => datum.value,
        elementType: 'area',
        stacked: true,
      },
    ],
    []
  );

  return (
    <div className="chart-container">
      <Chart options={{ data: chartData, primaryAxis, secondaryAxes, dark: false }} />
    </div>
  );
}

export function BarChartComponent({ data }: { data: any[] }) {
  const chartData = useMemo(() => mapData(data, ['y1', 'y2', 'y3', 'y4'], ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4']), [data]);

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: datum => datum.value,
        elementType: 'bar',
      },
    ],
    []
  );

  return (
    <div className="chart-container">
      <Chart options={{ data: chartData, primaryAxis, secondaryAxes, dark: false }} />
    </div>
  );
}

export function LineChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => mapData(data, ['y1'], ['Metric 1']), [data]);

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: datum => datum.value,
        elementType: 'line',
      },
    ],
    []
  );

  return (
    <div className="chart-container">
      <Chart options={{ data: chartData, primaryAxis, secondaryAxes, dark: false }} />
    </div>
  );
}

export function StepLineChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => mapData(data, ['y1'], ['Metric 1']), [data]);

  const primaryAxis = useMemo(
    (): AxisOptions<MyDatum> => ({
      getValue: datum => datum.date,
    }),
    []
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<MyDatum>[] => [
      {
        getValue: datum => datum.value,
        elementType: 'line',
      },
    ],
    []
  );

  return (
    <div className="chart-container">
      <Chart options={{ data: chartData, primaryAxis, secondaryAxes, dark: false }} />
    </div>
  );
}
