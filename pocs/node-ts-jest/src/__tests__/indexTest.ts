import { } from 'jest';
import { calculator } from '../index';

test('adds 1 + 2 to equal 3', () => {
    expect(calculator.sum(1, 2)).toBe(3);
});

test('adds 3 - 2 to equal 1', () => {
    expect(calculator.sub(3, 2)).toBe(1);
});

test('adds 5 * 5 to equal 25', () => {
    expect(calculator.mul(5, 5)).toBe(25);
});

test('adds 25 / 5 to equal 5', () => {
    expect(calculator.div(25, 5)).toBe(5);
});