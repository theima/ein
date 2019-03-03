import { Observable } from 'rxjs';
import { Prevent } from './prevent';

export type CanLeave = (model: any) => Observable<boolean | Prevent>;
