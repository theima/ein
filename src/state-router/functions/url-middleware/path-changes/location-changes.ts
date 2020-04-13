import { Location } from 'history';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { history } from './history';

export function locationChanges():Observable<Location> {
  const changes: ReplaySubject<[Location, 'PUSH' | 'POP' | 'REPLACE']> = new ReplaySubject(1);
  changes.next([history.location, 'POP']);
  history.listen((location: Location, historyAction: 'PUSH' | 'POP' | 'REPLACE') => {
    changes.next([location, historyAction]);
  });
  return changes.pipe(
    filter((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return values[1] === 'POP';
    }),
    map((values: [Location, 'PUSH' | 'POP' | 'REPLACE']) => {
      return values[0];
    })
  );
}
