import { Subject } from 'rxjs';
import { Action } from '../../../core';
import { Selector } from './selector';

export interface ActionSelect {
  selector: Selector;
  subject: Subject<Action>;
  type: string;
}
