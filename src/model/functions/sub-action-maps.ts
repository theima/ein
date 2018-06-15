import { ActionMap } from '../types-and-interfaces/action-map';

export interface SubActionMaps {
  [key: string]: ActionMap<any>;
}
