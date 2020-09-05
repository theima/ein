import { Reducer } from '../../../core';
import { ActionMap } from '../../../html-parser/types-and-interfaces/action-map';
import { ViewTemplate } from './view-template';

export interface NodeViewTemplate extends ViewTemplate {
  reducer: Reducer<any>;
  actionMap: ActionMap;
}
