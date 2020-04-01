import { Observable } from 'rxjs';
import { Dict } from '../../../core';
import { CanEnter } from './can-enter';
import { Config } from './config';
import { Data } from './data';
import { Prevent } from './prevent';
import { Title } from './title';

export interface StateConfig extends Config {
  title?: string | Title;
  path?: string;
  children?: StateConfig[];
  data?: Dict<Data>;
  canEnter?: CanEnter;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
}
