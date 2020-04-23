export interface Translator<T, U> {
  get: (m: T) => U | null;
  give: (m: T, mm: U) => T;
}
