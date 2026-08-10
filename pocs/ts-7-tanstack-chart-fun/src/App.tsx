import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MultiLineChart, StackedAreaChart, BarChartComponent, LineChart, StepLineChart } from './components/charts';
import { generateTimeSeriesData } from './data/generators';

function App() {
  const [chartData, setChartData] = useState(generateTimeSeriesData(100));
  const [isRunning, setIsRunning] = useState(false);
  const [refreshRate, setRefreshRate] = useState(1000);
  const [selectedChart, setSelectedChart] = useState('multiline');
  const intervalRef = useRef<number | null>(null);

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
    intervalRef.current = window.setInterval(() => {
      setChartData(prev => {
        const newData = prev.slice(1);
        const time = new Date();
        const y1 = Math.sin(newData.length * 0.1) * 20 + Math.random() * 10 + 50;
        newData.push({ 
          x: time, 
          y1: Number(y1.toFixed(2)), 
          y2: Number(Math.cos(newData.length * 0.15) * 25 + 30), 
          y3: Number(Math.sin(newData.length * 0.2) * 30 + 20), 
          y4: Number(Math.sin(newData.length * 0.08) * 15 + 10), 
          label: 'T-' + newData.length 
        });
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
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div>
            <h1 className="title">TanStack Charts Playground</h1>
            <p className="subtitle">Statistical · Spatial · Hierarchy · Network Primitives</p>
          </div>
          <div className={`status-badge ${isRunning ? 'running' : 'stopped'}`}>
            <span className={`status-dot ${isRunning ? 'pulse' : ''}`}></span>
            {isRunning ? 'Live' : 'Stopped'}
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="controls-grid">
          <div className="card">
            <h2 className="card-title">Live Data</h2>
            <div className="card-body">
              <div className="flex-between">
                <span>Playback</span>
                <div className="button-group">
                  <button className={`btn ${isRunning ? 'btn-danger' : 'btn-primary'}`} onClick={isRunning ? stopLiveUpdate : startLiveUpdate}>
                    {isRunning ? 'Stop' : 'Start'}
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setChartData(generateTimeSeriesData(100)); setIsRunning(false); }}>
                    Reset
                  </button>
                </div>
              </div>
              <div className="range-control">
                <label>Refresh Rate: {refreshRate}ms</label>
                <input type="range" min="100" max="2000" step="100" value={refreshRate} onChange={(e) => setRefreshRate(Number(e.target.value))} disabled={!isRunning} />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Chart Type</h2>
            <div className="card-body chart-types">
              {CHARTS.map(config => (
                <button key={config.id} onClick={() => setSelectedChart(config.id)} className={`btn-chart ${selectedChart === config.id ? 'active' : ''}`}>
                  {config.title}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Statistics</h2>
            <div className="card-body stats-grid">
              <div className="stat-box">
                <div className="stat-value">{chartData.length}</div>
                <div className="stat-label">Data Points</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{Math.max(...chartData.map(d => d.y1 || 0)).toFixed(2)}</div>
                <div className="stat-label">Max Y1</div>
              </div>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card main-chart-card">
            <h3 className="card-title">{selectedConfig?.title}</h3>
            {selectedConfig?.component && <selectedConfig.component data={chartData} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
