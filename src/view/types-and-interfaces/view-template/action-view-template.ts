import { ActionMap } from '../../../html-parser/types-and-interfaces/action-map';
import { ViewTemplate } from './view-template';

export interface ActionViewTemplate extends ViewTemplate {
  actionMap: ActionMap;
}
