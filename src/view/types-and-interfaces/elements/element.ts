import { ActionHandler } from '../action-handler';
import { Property } from '../property';

export interface Element {
  name: string;
  id: string;
  properties: Property[];
  handlers?: ActionHandler[];
}
