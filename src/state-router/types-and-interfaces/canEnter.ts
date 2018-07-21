import { Observable } from 'rxjs';
import { Prevent } from './prevent';
import { Action } from '../../core';

export type CanEnter = (model: any) => Observable<boolean | Prevent | Action>;
