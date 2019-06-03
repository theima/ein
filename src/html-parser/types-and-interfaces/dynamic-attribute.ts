import { WrappedDynamicValueString } from './wrapped-dynamic-value-string';

export interface DynamicAttribute {
  name: string;
  value: WrappedDynamicValueString | string;
}
