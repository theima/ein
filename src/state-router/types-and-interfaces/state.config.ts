import { Observable } from 'rxjs';
import { Dict } from '../../core';
import { CanEnter } from './can-enter';
import { Config } from './config';
import { Data } from './data';
import { Prevent } from './prevent';

export interface StateConfig extends Config {
  children?: StateConfig[];
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
}
