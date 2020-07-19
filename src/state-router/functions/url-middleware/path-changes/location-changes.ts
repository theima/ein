import { Action, Location, Update } from 'history';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { history } from './history';

export function locationChanges():Observable<Location> {
  const changes: ReplaySubject<Update> = new ReplaySubject(1);
  changes.next({location:history.location, action: Action.Pop});
  history.listen((update: Update) => {
    changes.next(update);
  });
  return changes.pipe(
    filter((update: Update) => {
      return update.action === Action.Pop;
    }),
    map((update: Update) => {
      return update.location;
    })
  );
}
