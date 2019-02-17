import { Observable } from 'rxjs/index';
import { Action } from '../../core';

export type Select = (selector: string, type: string) => Observable<Action>;
