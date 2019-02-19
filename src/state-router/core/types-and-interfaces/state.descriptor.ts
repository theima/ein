import { RuleDescriptor } from './rule.descriptor';
import { Data } from './data';
import { CanEnter } from './canEnter';
import { Observable } from 'rxjs';
import { Prevent } from './prevent';
import { Dict } from '../../../core';

export interface StateDescriptor {
  name: string;
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
  rule: RuleDescriptor | null;
  parent: string | null;
}
