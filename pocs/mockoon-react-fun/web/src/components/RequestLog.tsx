import { useEffect, useState } from 'react';
import { apiBase, onRequest, type LogEntry } from '../api/client.ts';

const KEEP = 8;

export const RequestLog = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => onRequest((entry) => setEntries((current) => [entry, ...current].slice(0, KEEP))), []);

  const latest = entries[0];
  const down = latest?.status === 0;

  return (
    <footer className="logbar">
      <span className="logbar__label">
        <i className={down ? 'beacon beacon--down' : 'beacon'} />
        mockoon · {apiBase.replace(/^https?:\/\//, '')}
      </span>
      <div className="logbar__stream">
        {entries.map((entry) => (
          <span key={entry.id} className={entry.failed ? 'logline logline--bad' : 'logline'}>
            <b className="logline__method">{entry.method}</b>
            <span className="logline__path">{entry.path}</span>
            <span className="logline__status">{entry.status === 0 ? 'ERR' : entry.status}</span>
            <span className="logline__ms">{entry.ms}ms</span>
          </span>
        ))}
      </div>
    </footer>
  );
};
