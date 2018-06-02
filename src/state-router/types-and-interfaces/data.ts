import { Observable } from 'rxjs';
import { State } from './state';

export type Data = (model: any, state: State) => Observable<any>;
