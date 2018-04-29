
import { history } from '../history';
import { Location } from 'history';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

export function locationChanges(): Observable<[Location, 'PUSH' | 'POP' | 'REPLACE']> {
  const s: ReplaySubject<[Location, 'PUSH' | 'POP' | 'REPLACE']> = new ReplaySubject(1);
  s.next([history.location, 'POP']);
  history.listen((location: Location, historyAction: 'PUSH' | 'POP' | 'REPLACE') => {
    s.next([location, historyAction]);
  });
  return s;
}
