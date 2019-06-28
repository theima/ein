import { Observable } from 'rxjs';
import { State } from './state';
import { Value } from '../../core';

export type Data = (model: Value, state: State) => Observable<any>;
