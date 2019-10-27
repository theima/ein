import { Observable } from 'rxjs';
import { Action } from '../../../core';
import { ActionHandler } from '../action-handler';
import { Property } from '../property';

export interface Element {
  name: string;
  id: string;
  properties: Property[];
  handlers?: ActionHandler[];
  actionStream?: Observable<Action>;
}
