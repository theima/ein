import { Observable } from 'rxjs';
import { Dict } from '../../../core';
import { Config } from './config';
import { Data } from './data';
import { Prevent } from './prevent';
import { Title } from './title';

export interface StateConfig extends Config {
  name: string;
  title?: string | Title;
  path?: string;
  children?: StateConfig[];
  data?: Dict<Data>;
  canLeave?: (model: any) => Observable<boolean | Prevent>;
}
