export interface Translator<T, U> {
  get: (m: T) => U | undefined;
  give: (m: T, mm: U) => T;
}
