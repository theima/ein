import { ElementData } from './element-data';
import { Select } from '../select';
import { Observable } from 'rxjs';
import { Action } from '../../../core';

export interface ViewElementData extends ElementData {
  actions: (select: Select) => Observable<Action>;
}
