import { Data } from './data';
import { Observable } from 'rxjs';
import { Config } from './config';
import { Prevent } from './prevent';
import { CanEnter } from './can-enter';
import { Dict } from '../../core';

export interface StateConfig extends Config {
  children?: StateConfig[];
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
}
