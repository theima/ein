import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Data } from '../../../types-and-interfaces/data';
import { State } from '../../../types-and-interfaces/state';

import { Dict, dictToArray, Value } from '../../../../core';
import { getFirst } from '../get-first';

export function createDataObservable(model: Value, state: State, data: Dict<Data>): Observable<object> {
  let observables: Array<Observable<any>> = dictToArray(data).map((data: Data) => {
    return getFirst(data(model, state));
  });
  const dataKeys: string[] = Object.keys(data);
  if (observables.length > 0) {
    return forkJoin(...observables).pipe(map((values: any[]) => {
      return values.reduce((result: object, item: any, currentIndex: number) => {
        const key: string = dataKeys[currentIndex];
        result[key] = item;
        return result;
      }, {});
    }));
  }
  return from([{}]);
}
