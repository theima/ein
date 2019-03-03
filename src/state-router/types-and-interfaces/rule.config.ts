import { Config } from './config';
import { CanEnter } from './can-enter';

export interface RuleConfig {
  canEnter: CanEnter;
  states: Array<RuleConfig | Config>;
}
