import { useCallback, useState } from 'react';
import { calculations } from '../api/index.ts';
import { Alert } from '../components/Alert.tsx';
import { Empty } from '../components/Empty.tsx';
import { Panel } from '../components/Panel.tsx';
import { useResource } from '../hooks/useResource.ts';
import type { Calculation, Operator } from '../types/api.ts';

const OPERATORS: readonly Operator[] = ['+', '-', '*', '/', '%'];
const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '±'] as const;

const format = (value: number): string => {
  if (!Number.isFinite(value)) return '—';
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
};

export const CalculatorTab = () => {
  const [left, setLeft] = useState('12');
  const [op, setOp] = useState<Operator>('*');
  const [right, setRight] = useState('7');
  const [active, setActive] = useState<'left' | 'right'>('right');

  const load = useCallback(() => calculations.list(), []);
  const { data, error, loading, run } = useResource<Calculation[]>(load, []);

  const setActiveValue = (updater: (current: string) => string) => {
    if (active === 'left') setLeft(updater(left));
    else setRight(updater(right));
  };

  const press = (key: (typeof KEYS)[number]) => {
    setActiveValue((current) => {
      if (key === '±') return current.startsWith('-') ? current.slice(1) : `-${current}`;
      if (key === '.') return current.includes('.') ? current : `${current || '0'}.`;
      return current === '0' ? key : current + key;
    });
  };

  const clear = () => setActiveValue(() => '0');

  const evaluate = () =>
    run(() => calculations.evaluate({ a: Number(left) || 0, op, b: Number(right) || 0 }));

  const latest = data[data.length - 1];

  return (
    <div className="view split split--panel-first">
      <Panel title="Evaluator" note="the mock does the arithmetic">
        <Alert message={error} />
        <div
          style={{
            padding: '18px 20px',
            marginBottom: 16,
            border: '1px solid var(--rule-bright)',
            borderRadius: 8,
            background: 'var(--void)',
            textAlign: 'right'
          }}
        >
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.1em' }}>
            {latest ? `LAST · ${latest.a} ${latest.op} ${latest.b}` : 'AWAITING FIRST REQUEST'}
          </div>
          <div
            style={{
              fontFamily: 'var(--display)',
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.15,
              color: 'var(--signal)'
            }}
          >
            {latest ? format(latest.result) : '0'}
          </div>
        </div>

        <div className="row" style={{ marginBottom: 14, flexWrap: 'nowrap' }}>
          <input
            className="control"
            style={{ textAlign: 'right', borderColor: active === 'left' ? 'var(--signal)' : undefined }}
            value={left}
            onFocus={() => setActive('left')}
            onChange={(event) => setLeft(event.target.value)}
          />
          <select
            className="control"
            style={{ width: 66, textAlign: 'center' }}
            value={op}
            onChange={(event) => setOp(event.target.value as Operator)}
          >
            {OPERATORS.map((operator) => (
              <option key={operator} value={operator}>
                {operator}
              </option>
            ))}
          </select>
          <input
            className="control"
            style={{ textAlign: 'right', borderColor: active === 'right' ? 'var(--signal)' : undefined }}
            value={right}
            onFocus={() => setActive('right')}
            onChange={(event) => setRight(event.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7, marginBottom: 12 }}>
          {KEYS.map((key) => (
            <button key={key} className="btn" onClick={() => press(key)}>
              {key}
            </button>
          ))}
        </div>

        <div className="row">
          <button className="btn btn--primary" style={{ flex: 1 }} onClick={() => void evaluate()}>
            Send to mock
          </button>
          <button className="btn" onClick={clear}>
            Clear {active}
          </button>
        </div>
      </Panel>

      <Panel
        title="History"
        actions={
          <button className="btn btn--tiny btn--ghost btn--danger" onClick={() => void run(calculations.clear)}>
            Clear all
          </button>
        }
      >
        {data.length === 0 ? (
          <Empty>{loading ? 'Loading…' : 'Every accepted calculation lands in the mock data bucket.'}</Empty>
        ) : (
          <table className="grid-table">
            <thead>
              <tr>
                <th>Expression</th>
                <th>Result</th>
                <th>At</th>
                <th aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((entry) => (
                <tr key={entry.id} style={{ cursor: 'default' }}>
                  <td className="mono">
                    {entry.a} {entry.op} {entry.b}
                  </td>
                  <td style={{ color: 'var(--signal)', fontFamily: 'var(--mono)' }}>{format(entry.result)}</td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {new Date(entry.computedAt).toLocaleTimeString()}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn--ghost btn--tiny btn--danger"
                      onClick={() => void run(() => calculations.remove(entry.id))}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
};
