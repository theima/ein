import { Observable } from 'rxjs/Observable';
import { State } from './state';

export type Data = (model: any, state: State) => Observable<any>;
