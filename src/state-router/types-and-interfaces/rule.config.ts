import { CanEnter } from './can-enter';
import { Config } from './config';

export interface RuleConfig {
  canEnter: CanEnter;
  states: Array<RuleConfig | Config>;
}
