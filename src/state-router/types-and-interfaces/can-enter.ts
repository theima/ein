import { Observable } from 'rxjs';
import { Action } from '../../core';
import { Prevent } from './prevent';

export type CanEnter = (model: any) => Observable<boolean | Prevent | Action>;
