export function partial<A, B, C>(func: (a: A, b: B) => C, a: A): (b: B) => C;
export function partial<A, B, C, D>(func: (a: A, b: B, c: C) => D, a: A): (b: B, c: C) => D;
export function partial<A, B, C, D>(func: (a: A, b: B, c: C) => D, a: A, b: B): (c: C) => D;
export function partial<A, B, C, D, E>(func: (a: A, b: B, c: C, d: D) => E, a: A): (b: B, c: C, d: D) => E;
export function partial<A, B, C, D, E>(func: (a: A, b: B, c: C, d: D) => E, a: A, b: B): (c: C, d: D) => E;
export function partial<A, B, C, D, E>(func: (a: A, b: B, c: C, d: D) => E, a: A, b: B, c: C): (d: D) => E;
export function partial<A, B, C, D, E, F>(func: (a: A, b: B, c: C, d: D, e: E) => F, a: A): (b: B, c: C, d: D, e: E) => F;
export function partial<A, B, C, D, E, F>(func: (a: A, b: B, c: C, d: D, e: E) => F, a: A, b: B): (c: C, d: D, e: E) => F;
export function partial<A, B, C, D, E, F>(func: (a: A, b: B, c: C, d: D, e: E) => F, a: A, b: B, c: C): (d: D, e: E) => F;
export function partial<A, B, C, D, E, F>(func: (a: A, b: B, c: C, d: D, e: E) => F, a: A, b: B, c: C, d: D): (e: E) => F;
export function partial<A, B, C, D, E, F, G>(func: (a: A, b: B, c: C, d: D, e: E, f: F) => G, a: A): (b: B, c: C, d: D, e: E, f: F) => G;
export function partial<A, B, C, D, E, F, G>(func: (a: A, b: B, c: C, d: D, e: E, f: F) => G, a: A, b: B): (c: C, d: D, e: E, f: F) => G;
export function partial<A, B, C, D, E, F, G>(func: (a: A, b: B, c: C, d: D, e: E, f: F) => G, a: A, b: B, c: C): (d: D, e: E, f: F) => G;
export function partial<A, B, C, D, E, F, G>(func: (a: A, b: B, c: C, d: D, e: E, f: F) => G, a: A, b: B, c: C, d: D): (e: E, f: F) => G;
export function partial<A, B, C, D, E, F, G>(func: (a: A, b: B, c: C, d: D, e: E, f: F) => G, a: A, b: B, c: C, d: D, e: E): (f: F) => G;
export function partial<A, B, C, D, E, F, G, H>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H, a: A): (b: B, c: C, d: D, e: E, f: F, g: G) => H;
export function partial<A, B, C, D, E, F, G, H>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H, a: A, b: B): (c: C, d: D, e: E, f: F, g: G) => H;
export function partial<A, B, C, D, E, F, G, H>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H, a: A, b: B, c: C): (d: D, e: E, f: F, g: G) => H;
export function partial<A, B, C, D, E, F, G, H>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H, a: A, b: B, c: C, d: D): (e: E, f: F, g: G) => H;
export function partial<A, B, C, D, E, F, G, H>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H, a: A, b: B, c: C, d: D, e: E): (f: F, g: G) => H;
export function partial<A, B, C, D, E, F, G, H>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H, a: A, b: B, c: C, d: D, e: E, f: F): (g: G) => H;

export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A): (b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I;
export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A, b: B): (c: C, d: D, e: E, f: F, g: G, h: H) => I;
export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A, b: B, c: C): (d: D, e: E, f: F, g: G, h: H) => I;
export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A, b: B, c: C, d: D): (e: E, f: F, g: G, h: H) => I;
export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A, b: B, c: C, d: D, e: E): (f: F, g: G, h: H) => I;
export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A, b: B, c: C, d: D, e: E, f: F): (g: G, h: H) => I;
export function partial<A, B, C, D, E, F, G, H, I>(func: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H) => I, a: A, b: B, c: C, d: D, e: E, f: F, g: G): (h: H) => I;
export function partial(func: (...params: any[]) => any, ...partialParams: any[]): (...params: any[]) => any {
  return (...params) => {
    return func(...partialParams, ...params);
  };
}
