import { ActionHandler } from '../action-handler';
import { Observable } from 'rxjs';
import { Attribute } from '../attribute';
import { Action } from '../../../core';

export interface Element {
  name: string;
  id: string;
  attributes: Attribute[];
  handlers?: ActionHandler[];
  actionStream?: Observable<Action>;
}
