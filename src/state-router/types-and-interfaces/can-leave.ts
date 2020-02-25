import { Observable } from 'rxjs';
import { Value } from '../../core';
import { Prevent } from './prevent';

export type CanLeave = (model: Value) => Observable<boolean | Prevent>;
