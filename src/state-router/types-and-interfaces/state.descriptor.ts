import { RuleDescriptor } from './rule.descriptor';
import { Data } from './data';
import { CanEnter } from './can-enter';
import { Dict } from '../../core';
import { CanLeave } from './can-leave';

export interface StateDescriptor {
  name: string;
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: CanLeave;
  rule: RuleDescriptor | null;
  parent: string | null;
}
