import { ActionMap } from '../action-map';
import { ViewTemplate } from './view-template';

export interface ActionViewTemplate extends ViewTemplate {
  actionMap: ActionMap;
}
