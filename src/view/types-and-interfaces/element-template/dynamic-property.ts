import { ModelToValue } from '../../../core/types-and-interfaces/model-to-value';

export interface DynamicProperty {
  name: string;
  value: ModelToValue;
  dynamic: true;
}
