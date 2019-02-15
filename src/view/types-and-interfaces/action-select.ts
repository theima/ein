import { Subject } from 'rxjs';
import { Selector } from './selector';
import { Action } from '../../core';

export interface ActionSelect {
  selector: Selector;
  subject: Subject<Action>;
  type: string;
}
