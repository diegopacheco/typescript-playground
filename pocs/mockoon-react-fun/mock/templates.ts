import type { ResponseRule } from './mockoon-types.ts';

export type ExtraResponse = {
  statusCode: number;
  label: string;
  body: string;
  rules: ResponseRule[];
};

export type RouteTemplate = {
  statusCode: number;
  body: string;
  before: ExtraResponse[];
};

const bodyRule = (path: string, value: string, operator: ResponseRule['operator'] = 'equals'): ResponseRule => ({
  target: 'body',
  modifier: path,
  value,
  invert: false,
  operator
});

const timestamp = `(now "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")`;

const evaluateBody = [
  `{{setVar 'a' (bodyRaw 'a')}}`,
  `{{setVar 'b' (bodyRaw 'b')}}`,
  `{{#switch (bodyRaw 'op')}}`,
  `{{#case '+'}}{{setVar 'result' (add (getVar 'a') (getVar 'b'))}}{{/case}}`,
  `{{#case '-'}}{{setVar 'result' (subtract (getVar 'a') (getVar 'b'))}}{{/case}}`,
  `{{#case '*'}}{{setVar 'result' (multiply (getVar 'a') (getVar 'b'))}}{{/case}}`,
  `{{#case '/'}}{{setVar 'result' (divide (getVar 'a') (getVar 'b'))}}{{/case}}`,
  `{{#case '%'}}{{setVar 'result' (modulo (getVar 'a') (getVar 'b'))}}{{/case}}`,
  `{{/switch}}`,
  `{{setVar 'record' (object id=(guid) a=(getVar 'a') op=(bodyRaw 'op') b=(getVar 'b') result=(getVar 'result') computedAt=${timestamp})}}`,
  `{{setData 'push' 'calculations' '' (getVar 'record')}}`,
  `{{{stringify (getVar 'record')}}}`
].join('');

const winningMoves: Record<string, string> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const outcomeCases = Object.entries(winningMoves)
  .flatMap(([move, beats]) => [
    `{{#case '${move}|${beats}'}}{{setVar 'outcome' 'win'}}{{/case}}`,
    `{{#case '${move}|${move}'}}{{setVar 'outcome' 'draw'}}{{/case}}`
  ])
  .join('');

const playRoundBody = [
  `{{setVar 'playerMove' (bodyRaw 'move')}}`,
  `{{setVar 'computerMove' (oneOf (array 'rock' 'paper' 'scissors'))}}`,
  `{{#switch (concat (getVar 'playerMove') '|' (getVar 'computerMove'))}}`,
  outcomeCases,
  `{{#default}}{{setVar 'outcome' 'loss'}}{{/default}}`,
  `{{/switch}}`,
  `{{setVar 'record' (object id=(guid) playerMove=(getVar 'playerMove') computerMove=(getVar 'computerMove') outcome=(getVar 'outcome') playedAt=${timestamp})}}`,
  `{{setData 'push' 'rounds' '' (getVar 'record')}}`,
  `{{{stringify (getVar 'record')}}}`
].join('');

export const templates: Record<string, RouteTemplate> = {
  evaluate: {
    statusCode: 201,
    body: evaluateBody,
    before: [
      {
        statusCode: 400,
        label: 'Division by zero',
        body: JSON.stringify({ error: 'division_by_zero', message: 'The divisor must not be zero.' }, null, 2),
        rules: [bodyRule('op', '^[/%]$', 'regex'), bodyRule('b', '0')]
      }
    ]
  },
  playRound: {
    statusCode: 201,
    body: playRoundBody,
    before: [
      {
        statusCode: 400,
        label: 'Unknown move',
        body: JSON.stringify({ error: 'invalid_move', message: 'move must be rock, paper or scissors.' }, null, 2),
        rules: [{ ...bodyRule('move', '^(rock|paper|scissors)$', 'regex'), invert: true }]
      }
    ]
  }
};
