import { ActionHandler } from '../action-handler';
import { Property } from '../property';
import { ElementContent } from './element-content';

export interface Element {
  name: string;
  content: ElementContent;
  id: string;
  properties: Property[];
  handlers?: ActionHandler[];
}
