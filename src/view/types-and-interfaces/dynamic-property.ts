import { ModelToValue } from './model-to-value';

export interface DynamicProperty {
  name: string;
  value: ModelToValue;
  dynamic: true;
}
