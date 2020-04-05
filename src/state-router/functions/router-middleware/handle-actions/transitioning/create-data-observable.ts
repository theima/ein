import { forkJoin, from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Dict, dictToArray, Value } from '../../../../../core';
import { Data } from '../../../../types-and-interfaces/config/data';
import { State } from '../../../../types-and-interfaces/state/state';

export function createDataObservable(model: Value, state: State, data: Dict<Data>): Observable<Dict<Value>> {
  let observables: Array<Observable<Value>> = dictToArray(data).map((data: Data) => {
    return data(model, state).pipe(first());
  });
  const dataKeys: string[] = Object.keys(data);
  if (observables.length > 0) {
    return forkJoin(...observables).pipe(map((values: Value[]) => {
      return values.reduce((result: object, item: Value, currentIndex: number) => {
        const key: string = dataKeys[currentIndex];
        result[key] = item;
        return result;
      }, {});
    }));
  }
  return from([{}]);
}
