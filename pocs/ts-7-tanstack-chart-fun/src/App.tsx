import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Card, CardHeader, CardBody, CardFooter, Badge } from './ui';
import { MultiLineChart, StackedAreaChart, BarChartComponent, LineChart, StepLineChart } from './charts';
import { generateTimeSeriesData } from '../data/generators';
import { ChartDataPoint } from '../types';

function App() {
  const [chartData, setChartData] = useState(generateTimeSeriesData(100));
  const [isRunning, setIsRunning] = useState(false);
  const [refreshRate, setRefreshRate] = useState(1000);
  const [selectedChart, setSelectedChart] = useState('multiline');
  const intervalRef = useRef(null);

  const CHARTS = [
    { id: 'multiline', component: MultiLineChart, title: 'Multi-Line' },
    { id: 'stacked', component: StackedAreaChart, title: 'Stacked Area' },
    { id: 'bar', component: BarChartComponent, title: 'Bar Chart' },
    { id: 'line', component: LineChart, title: 'Line Chart' },
    { id: 'step', component: StepLineChart, title: 'Step Line' }
  ];

  const selectedConfig = CHARTS.find(c => c.id === selectedChart);

  const startLiveUpdate = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setChartData(prev => {
        const newData = prev.slice(1);
        const time = new Date();
        const y1 = Math.sin(newData.length * 0.1) * 20 + Math.random() * 10 + 50;
        newData.push({ x: time, y1: Number(y1.toFixed(2)), y2: Number(Math.cos(newData.length * 0.15) * 25 + 30), y3: Number(Math.sin(newData.length * 0.2) * 30 + 20), y4: Number(Math.sin(newData.length * 0.08) * 15 + 10), label: 'T-' + newData.length });
        return newData;
      });
    }, refreshRate);
  }, [refreshRate]);

  const stopLiveUpdate = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">TanStack Charts 0.7.0</h1>
              <p className="text-sm text-gray-500 mt-1">Statistical · Spatial · Hierarchy · Network Primitives</p>
            </div>
            <Badge variant={isRunning ? 'success' : 'default'}>
              <span className="flex items-center gap-1"><span className={'w-2 h-2 rounded-full ' + (isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400')}></span>{isRunning ? 'Live' : 'Stopped'}</span>
            </Badge>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader title="Live Data" />
            <CardBody className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Playback</span>
                <div className="flex gap-2">
                  <Button variant={isRunning ? 'danger' : 'primary'} size="sm" onClick={isRunning ? stopLiveUpdate : startLiveUpdate}>{isRunning ? 'Stop' : 'Start'}</Button>
                  <Button variant="secondary" size="sm" onClick={() => { setChartData(generateTimeSeriesData(100)); setIsRunning(false); }}>Reset</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Rate: {refreshRate}ms</label>
                <input type="range" min="100" max="2000" step="100" value={refreshRate} onChange={(e) => setRefreshRate(Number(e.target.value))} disabled={!isRunning} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['crosshair', 'brush', 'legend'].map(feature => (
                  <label key={feature} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                    <input type="checkbox" checked={feature === 'crosshair'} onChange={(e) => {}} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm text-gray-700 capitalize">{feature}</span>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Chart Type" subtitle="Select a chart to display" />
            <CardBody className="flex flex-wrap gap-2">
              {CHARTS.map(config => (
                <button key={config.id} onClick={() => setSelectedChart(config.id)} className={'px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (selectedChart === config.id ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-700 hover:border-violet-300')}>
                  {config.title}
                </button>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Statistics" />
            <CardBody className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-violet-600">{chartData.length}</div>
                <div className="text-xs text-gray-500">Data Points</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{Math.max(...chartData.map(d => d.y1 || 0)).toFixed(2)}</div>
                <div className="text-xs text-gray-500">Max Y1</div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Brush Selection" />
            <CardBody className="text-sm text-gray-500 text-center py-4">Interactive brush selection enabled</CardBody>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="h-[500px]">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedConfig?.title}</h3>
                <p className="text-sm text-gray-500">Interactive chart with crosshairs and brush selection</p>
              </div>
              <Badge variant="info">Live</Badge>
            </CardHeader>
            <CardBody className="p-0 pt-0">
              {selectedConfig?.component && <selectedConfig.component data={chartData} />}
            </CardBody>
          </Card>
          <Card className="h-[500px]">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Multi-Chart Composition</h3>
                <p className="text-sm text-gray-500">Multiple charts displayed simultaneously</p>
              </div>
              <Badge variant="success">Static</Badge>
            </CardHeader>
            <CardBody className="p-0 pt-0 space-y-6">
              <div className="h-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Performance</span>
                  <Badge variant="info">Real-time</Badge>
                </div>
                <MultiLineChart data={generateTimeSeriesData(50)} />
              </div>
              <div className="h-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Distribution</span>
                  <Badge variant="success">Static</Badge>
                </div>
                <BarChartComponent data={generateTimeSeriesData(20)} />
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="h-[300px]">
            <CardHeader><h3 className="text-lg font-semibold text-gray-900">Network Graph</h3><p className="text-sm text-gray-500">Nodes and connections</p></CardHeader>
            <CardBody className="p-0 pt-0"><div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">Network visualization placeholder</div></CardBody>
          </Card>
          <Card className="h-[300px]">
            <CardHeader><h3 className="text-lg font-semibold text-gray-900">Hierarchical Tree</h3><p className="text-sm text-gray-500">Tree structure visualization</p></CardHeader>
            <CardBody className="p-0 pt-0"><div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">Hierarchy visualization placeholder</div></CardBody>
          </Card>
          <Card className="h-[300px]">
            <CardHeader><h3 className="text-lg font-semibold text-gray-900">Spatial Distribution</h3><p className="text-sm text-gray-500">Geographic scatter plot</p></CardHeader>
            <CardBody className="p-0 pt-0"><div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">Spatial visualization placeholder</div></CardBody>
          </Card>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Built with React, TypeScript, and TanStack Charts 0.7.0</p>
            <div className="flex items-center gap-4">
              <Badge variant="default">React 19</Badge>
              <Badge variant="default">TypeScript 5</Badge>
              <Badge variant="default">Vite</Badge>
              <Badge variant="default">TanStack Charts</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
