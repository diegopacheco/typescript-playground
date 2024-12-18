import { Some, None, Option } from '../src/index';

// Helper functions for testing
const f = (x: number): Option<number> => new Some(x + 1);
const g = (x: number): Option<number> => new Some(x * 2);

describe('OptionTrait Monad Laws', () => {
  test('Left Identity: return a >>= f is equivalent to f a', () => {
    const some = new Some(5);
    const leftIdentity = some.flatMap(f);
    const rightIdentity = f(5);

    expect(leftIdentity).toEqual(rightIdentity);
  });

  test('Right Identity: m >>= return is equivalent to m', () => {
    const some = new Some(5);
    const none = new None<number>();

    const rightIdentitySome = some.flatMap(x => new Some(x));
    const rightIdentityNone = none.flatMap(() => new None<number>());

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

    expect(leftAssociativitySome).toEqual(rightAssociativitySome);
    expect(leftAssociativityNone).toEqual(rightAssociativityNone);
  });

  test('Some Monad usage', () => {
    const some = new Some(5);
    const none = new None();
    const result = some.flatMap((value) => new Some(value + 5));
    console.log(result);
    expect(result).toEqual(new Some(10));
  });

});