import { ActionMap, ActionMaps } from '../../../core';
import { ViewElementData } from './view.element-data';

export interface NodeViewElementData extends ViewElementData {
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
}
