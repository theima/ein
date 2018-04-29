import { Dict } from './dict';
import { Data } from './data';
import { Observable } from 'rxjs/Observable';
import { Config } from './config';
import { Prevent } from './prevent';
import { CanEnter } from './canEnter';

export interface StateConfig extends Config {
  children?: StateConfig[];
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
}
