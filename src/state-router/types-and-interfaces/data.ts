import { Observable } from 'rxjs';
import { Value } from '../../core';
import { State } from './state';

export type Data = (model: Value, state: State) => Observable<any>;
