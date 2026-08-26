import { useCallback, useMemo, useState } from 'react';
import { rounds } from '../api/index.ts';
import { Alert } from '../components/Alert.tsx';
import { Empty } from '../components/Empty.tsx';
import { Panel } from '../components/Panel.tsx';
import { useResource } from '../hooks/useResource.ts';
import type { Move, Outcome, Round } from '../types/api.ts';

const MOVES: readonly Move[] = ['rock', 'paper', 'scissors'];

const GLYPH: Record<Move, string> = { rock: '✊', paper: '✋', scissors: '✌️' };

const TONE: Record<Outcome, string> = {
  win: 'var(--green)',
  draw: 'var(--text-dim)',
  loss: 'var(--rose)'
};

const VERDICT: Record<Outcome, string> = {
  win: 'You take it',
  draw: 'Dead heat',
  loss: 'Mock wins'
};

export const GameTab = () => {
  const [pending, setPending] = useState<Move | null>(null);

  const load = useCallback(() => rounds.list(), []);
  const { data, error, run } = useResource<Round[]>(load, []);

  const play = async (move: Move) => {
    setPending(move);
    await run(() => rounds.play(move));
    setPending(null);
  };

  const tally = useMemo(() => {
    const counts: Record<Outcome, number> = { win: 0, draw: 0, loss: 0 };
    for (const round of data) counts[round.outcome] += 1;
    return counts;
  }, [data]);

  const latest = data[data.length - 1];

  return (
    <div className="view split split--aside">
      <Panel title="Table" note="the mock picks its move and calls the result">
        <Alert message={error} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: 16,
            padding: '26px 18px',
            marginBottom: 18,
            border: '1px solid var(--rule-bright)',
            borderRadius: 10,
            background: 'var(--void)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 54, lineHeight: 1 }}>
              {pending ? GLYPH[pending] : latest ? GLYPH[latest.playerMove] : '·'}
            </div>
            <div className="mono" style={{ marginTop: 8, fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-faint)' }}>
              YOU
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: latest && !pending ? TONE[latest.outcome] : 'var(--text-faint)'
              }}
            >
              {pending ? 'ASKING…' : latest ? VERDICT[latest.outcome].toUpperCase() : 'VS'}
            </div>
            <div className="mono" style={{ marginTop: 6, fontSize: 10, color: 'var(--text-faint)' }}>
              {tally.win}W · {tally.draw}D · {tally.loss}L
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 54, lineHeight: 1 }}>
              {pending ? '❔' : latest ? GLYPH[latest.computerMove] : '·'}
            </div>
            <div className="mono" style={{ marginTop: 8, fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-faint)' }}>
              MOCKOON
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
          {MOVES.map((move) => (
            <button
              key={move}
              className="btn"
              onClick={() => void play(move)}
              disabled={pending !== null}
              style={{ flexDirection: 'column', gap: 4, padding: '15px 8px', fontSize: 12 }}
            >
              <span style={{ fontSize: 26 }}>{GLYPH[move]}</span>
              {move}
            </button>
          ))}
        </div>

        <button className="btn btn--ghost btn--danger" onClick={() => void run(rounds.clear)} disabled={data.length === 0}>
          Reset the match
        </button>
      </Panel>

      <Panel title="Rounds" note={`${data.length} played`}>
        {data.length === 0 ? (
          <Empty>Throw something. Every round is stored server side.</Empty>
        ) : (
          <table className="grid-table grid-table--tight">
            <thead>
              <tr>
                <th>#</th>
                <th>You</th>
                <th>Mock</th>
                <th>Result</th>
                <th>At</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((round, index) => (
                <tr key={round.id} style={{ cursor: 'default' }}>
                  <td className="mono">{data.length - index}</td>
                  <td>
                    {GLYPH[round.playerMove]} <span className="mono">{round.playerMove}</span>
                  </td>
                  <td>
                    {GLYPH[round.computerMove]} <span className="mono">{round.computerMove}</span>
                  </td>
                  <td style={{ color: TONE[round.outcome], fontFamily: 'var(--mono)', fontSize: 12 }}>
                    {round.outcome}
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {new Date(round.playedAt).toLocaleTimeString()}
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
