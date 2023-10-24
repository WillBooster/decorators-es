const MAX_CACHE_SIZE = 10;

/**
 * A memoization decorator/function that caches the results of method calls to improve performance.
 * This decorator/function can be applied to methods in a class as a decorator and functions without context as a function.
 *
 * @template This The type of the `this` context within the method.
 * @template Args The types of the arguments to the method.
 * @template Return The return type of the method.
 *
 * @param {Function} target The method or function to be memoized.
 * @param {ClassMethodDecoratorContext} [context] The context in which the decorator is being applied. Optional for standard functions.
 *
 * @returns {Function} A new function that wraps the original method or function with caching logic.
 */
export function memoize<This, Args extends unknown[], Return>(
  target: ((this: This, ...args: Args) => Return) | ((...args: Args) => Return),
  context?: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
): (this: This, ...args: Args) => Return {
  const cache = new Map<string, Return>();

  return function (this: This, ...args: Args): Return {
    console.log(`Entering method ${context ? String(context.name) : ''}(${JSON.stringify(args)}).`);

    const key = JSON.stringify(args);
    let result;
    if (cache.has(key)) {
      result = cache.get(key) as Return;
    } else {
      result = context ? target.call(this, ...args) : (target as (...args: Args) => Return)(...args);
      cache.set(key, result);
      if (cache.size > MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
    }

    console.log(`Exiting method ${context ? String(context.name) : ''}${String(context?.name)}.`);
    return result;
  };
}
