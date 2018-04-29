import { RuleDescriptor } from './rule.descriptor';
import { Data } from './data';
import { Dict } from './dict';
import { CanEnter } from './canEnter';
import { Observable } from 'rxjs/Observable';
import { Prevent } from './prevent';

export interface StateDescriptor {
  name: string;
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
  rule: RuleDescriptor | null;
  parent: string | null;
}
