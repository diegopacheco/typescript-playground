"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
// Helper functions for testing
const f = (x) => new index_1.Some(x + 1);
const g = (x) => new index_1.Some(x * 2);
describe('OptionTrait Monad Laws', () => {
    test('Left Identity: return a >>= f is equivalent to f a', () => {
        const some = new index_1.Some(5);
        const leftIdentity = some.flatMap(f);
        const rightIdentity = f(5);
        expect(leftIdentity).toEqual(rightIdentity);
    });
    test('Right Identity: m >>= return is equivalent to m', () => {
        const some = new index_1.Some(5);
        const none = new index_1.None();
        const rightIdentitySome = some.flatMap(x => new index_1.Some(x));
        const rightIdentityNone = none.flatMap(() => new index_1.None());
        expect(rightIdentitySome).toEqual(some);
        expect(rightIdentityNone).toEqual(none);
    });
    test('Associativity: (m >>= f) >>= g is equivalent to m >>= (x -> f x >>= g)', () => {
        const some = new index_1.Some(5);
        const none = new index_1.None();
        const leftAssociativitySome = some.flatMap(f).flatMap(g);
        const rightAssociativitySome = some.flatMap((x) => f(x).flatMap(g));
        const leftAssociativityNone = none.flatMap(f).flatMap(g);
        const rightAssociativityNone = none.flatMap((x) => f(x).flatMap(g));
        expect(leftAssociativitySome).toEqual(rightAssociativitySome);
        expect(leftAssociativityNone).toEqual(rightAssociativityNone);
    });
    test('Some Monad usage', () => {
        const some = new index_1.Some(5);
        const none = new index_1.None();
        const result = some.flatMap((value) => new index_1.Some(value + 5));
        console.log(result);
        expect(result).toEqual(new index_1.Some(10));
    });
});
