export function partial<A extends readonly any[], B extends readonly any[], C>(func: (...args: [...A, ...B]) => C, ...partialParams: A): (...params: B) => C {
  return (...params: B) => {
    return func(...partialParams, ...params);
  };
}
