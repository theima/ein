import { Observable } from 'rxjs/Observable';
import { Dict } from '../types-and-interfaces/dict';
import { Data } from '../types-and-interfaces/data';
import { State } from '../types-and-interfaces/state';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/from';
import { getFirst } from './get-first';
import { dictToArray } from '../../core';

export function createDataObservable(model: any, state: State): (data: Dict<Data>) => Observable<object> {
  return (data: Dict<Data>) => {
    let observables: Array<Observable<any>> = dictToArray(data).map((data: Data) => {
      return getFirst(data(model, state));
    });
    const dataKeys: string[] = Object.keys(data);
    if (observables.length > 0) {
      return Observable.forkJoin(...observables).map((values: any[]) => {
        return values.reduce((result: object, item: any, currentIndex: number) => {
          const key: string = dataKeys[currentIndex];
          result[key] = item;
          return result;
        }, {});
      });
    }
    return Observable.from([{}]);
  };
}
