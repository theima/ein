import { ActionHandler } from '../action-handler';
import { Observable } from 'rxjs';
import { Property } from '../property';
import { Action } from '../../../core';

export interface Element {
  name: string;
  id: string;
  attributes: Property[];
  handlers?: ActionHandler[];
  actionStream?: Observable<Action>;
}
