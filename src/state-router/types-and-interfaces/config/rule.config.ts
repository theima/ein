import { CanEnter } from './can-enter';
import { Config } from './config';

export interface RuleConfig extends Config {
  canEnter: CanEnter;
  states: Config[];
}
