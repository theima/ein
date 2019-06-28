import { Value } from './value/value';

export type ModelToValue = (m: Value) => Array<object | string | number | boolean> | object | string | number | boolean | null;
