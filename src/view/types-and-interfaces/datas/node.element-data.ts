import { Observable } from 'rxjs';
import { ElementData, Select } from '../..';
import { Action, ActionMap, ActionMaps } from '../../../core';

export interface NodeElementData extends ElementData {
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: (select: Select) => Observable<Action>;
}
