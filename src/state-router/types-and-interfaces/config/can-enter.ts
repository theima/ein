import { Observable } from 'rxjs';
import { Action, Value } from '../../../core';
import { Prevent } from './prevent';

export type CanEnter = (model: Value) => Observable<boolean | Prevent | Action>;
