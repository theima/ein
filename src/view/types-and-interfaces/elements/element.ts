import { Property } from '../property';
import { ActionHandler } from '../select-action/action-handler';
import { ElementContent } from './element-content';

export interface Element {
  name: string;
  content: ElementContent;
  id: string;
  properties: Property[];
  handlers?: ActionHandler[];
}
