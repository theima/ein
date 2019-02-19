import { Config } from './config';
import { CanEnter } from './canEnter';

export interface RuleConfig {
  canEnter: CanEnter;
  states: Array<RuleConfig | Config>;
}
