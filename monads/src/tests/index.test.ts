import { Some, None, OptionTrait } from '../index';

// Helper functions for testing
const f = (x: number): OptionTrait<number> => new Some(x + 1);
const g = (x: number): OptionTrait<number> => new Some(x * 2);

describe('OptionTrait Monad Laws', () => {
  test('Left Identity: return a >>= f is equivalent to f a', () => {
    const some = new Some(5);
    const leftIdentity = some.flatMap(f);
    const rightIdentity = f(5);

    console.log('Left Identity - leftIdentity:', leftIdentity);
    console.log('Left Identity - rightIdentity:', rightIdentity);

    expect(leftIdentity).toEqual(rightIdentity);
  });

  test('Right Identity: m >>= return is equivalent to m', () => {
    const some = new Some(5);
    const none = new None<number>();

    const rightIdentitySome = some.flatMap(x => new Some(x));
    const rightIdentityNone = none.flatMap(() => new None<number>());

    console.log('Right Identity - rightIdentitySome:', rightIdentitySome);
    console.log('Right Identity - rightIdentityNone:', rightIdentityNone);

    expect(rightIdentitySome).toEqual(some);
    expect(rightIdentityNone).toEqual(none);
  });

  test('Associativity: (m >>= f) >>= g is equivalent to m >>= (x -> f x >>= g)', () => {
    const some = new Some(5);
    const none = new None<number>();

    const leftAssociativitySome = some.flatMap(f).flatMap(g);
    const rightAssociativitySome = some.flatMap((x: number) => f(x).flatMap(g));

    const leftAssociativityNone = none.flatMap(f).flatMap(g);
    const rightAssociativityNone = none.flatMap((x: number) => f(x).flatMap(g));

    console.log('Associativity - leftAssociativitySome:', leftAssociativitySome);
    console.log('Associativity - rightAssociativitySome:', rightAssociativitySome);
    console.log('Associativity - leftAssociativityNone:', leftAssociativityNone);
    console.log('Associativity - rightAssociativityNone:', rightAssociativityNone);

    expect(leftAssociativitySome).toEqual(rightAssociativitySome);
    expect(leftAssociativityNone).toEqual(rightAssociativityNone);
  });

  test('Some Monad usage', () => {
    const some = new Some(5);
    const result = some.flatMap((value) => new Some(value + 5));
    expect(result).toEqual(new Some(10));
  });
});