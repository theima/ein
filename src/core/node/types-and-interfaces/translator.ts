export interface Translator<T, U> {
  get: (m: T) => U;
  give: (m: T, mm: U) => T;
}
