import { ActionMap, ActionMaps } from '../../core';
import { Select } from '../../view/types-and-interfaces/select';

export interface HtmlNodeElementData {
  name: string;
  content: string;
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
  actions: Select;
}
