import { ChartDataPoint } from '../types';

export function generateTimeSeriesData(points: number = 100) {
  const data: ChartDataPoint[] = [];
  for (let i = 0; i < points; i++) {
    const time = new Date(Date.now() - (points - i) * 60000);
    const y1 = Math.sin(i * 0.1) * 20 + Math.random() * 10 + 50;
    const y2 = Math.cos(i * 0.15) * 25 + Math.random() * 15 + 30;
    const y3 = Math.sin(i * 0.2) * 30 + Math.random() * 20 + 20;
    const y4 = Math.sin(i * 0.08) * 15 + Math.random() * 10 + 10;
    data.push({
      x: time,
      y1: Number(y1.toFixed(2)),
      y2: Number(y2.toFixed(2)),
      y3: Number(y3.toFixed(2)),
      y4: Number(y4.toFixed(2)),
      label: 'T-' + (i + 1)
    });
  }
  return data;
}
