import { Observable } from 'rxjs';
import { Prevent } from './prevent';
import { Action } from '../../model';

export type CanEnter = (model: any) => Observable<boolean | Prevent | Action>;
