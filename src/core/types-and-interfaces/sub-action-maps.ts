import { ActionMap } from './action-map';

export interface SubActionMaps {
  [key: string]: ActionMap<any>;
}
