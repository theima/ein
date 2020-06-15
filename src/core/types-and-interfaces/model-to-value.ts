import { NullableValue } from './value/nullable-value';
import { Value } from './value/value';

export type ModelToValue = (m: Value) => NullableValue;
