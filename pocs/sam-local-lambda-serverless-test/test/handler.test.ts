import { sum, handler } from '../src/handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('sum function', () => {
  it('should sum two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(100, 200)).toBe(300);
  });
});

describe('handler', () => {
  it('should return sum result via API', async () => {
    const event = {
      body: JSON.stringify({ a: 5, b: 3 }),
    } as APIGatewayProxyEvent;
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ result: 8 });
  });
});
