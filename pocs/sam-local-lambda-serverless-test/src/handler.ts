import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface SumRequest {
  a: number;
  b: number;
}

export const sum = (a: number, b: number): number => {
  return a + b;
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body: SumRequest = JSON.parse(event.body || '{}');
    const result = sum(body.a, body.b);
    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' }),
    };
  }
};
