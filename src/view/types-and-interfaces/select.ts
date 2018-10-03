import { Observable } from 'rxjs/index';
import { ViewEvent } from './view-event';

export type Select = (selector: string, type: string) => Observable<ViewEvent>;
