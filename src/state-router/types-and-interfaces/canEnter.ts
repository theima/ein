import { Observable } from 'rxjs/Observable';
import { Prevent } from './prevent';
import { Action } from '../../model';

export type CanEnter = (model: any) => Observable<boolean | Prevent | Action>;
