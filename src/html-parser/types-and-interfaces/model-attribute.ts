import { WrappedModelValue } from './wrapped-model-value';

export interface ModelAttribute {
  name: string;
  value: WrappedModelValue | string;
}
