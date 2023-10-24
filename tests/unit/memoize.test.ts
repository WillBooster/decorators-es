import { memoize } from '../../src/memoize.js';

class Random {
  @memoize
  nextInteger(inclusiveMinInteger = 0, exclusiveMaxInteger = 100): number {
    return Math.floor(inclusiveMinInteger + Math.random() * exclusiveMaxInteger);
  }
}
const random = new Random();

const nextInteger = memoize((inclusiveMinInteger: number = 0, exclusiveMaxInteger: number = 100): number =>
  Math.floor(inclusiveMinInteger + Math.random() * exclusiveMaxInteger)
);

test.each([
  ['decorator', (...args: number[]) => random.nextInteger(...args)],
  ['function', (...args: number[]) => nextInteger(...args)],
])('memoize %s', (_, func) => {
  expect(func()).toBe(func());
  expect(func(100)).toBe(func(100));
  expect(func(0)).not.toBe(func(100));
});
