import { Observable, Subject } from 'rxjs/index';
import { Action } from '../../core';
import { ActionSelect } from '../types-and-interfaces/action-select';
import { Select } from '../types-and-interfaces/select';
import { createSelector } from './create-selector';

export function selectActions(selector: (select: Select) => Observable<Action>): { selects: ActionSelect[], stream: Observable<Action> } {
  let selects: ActionSelect[] = [];
  const select: Select = (selector: string, type: string) => {
    const subject: Subject<Action> = new Subject<Action>();
    selects.push(
      {
        subject,
        selector: createSelector(selector),
        type
      }
    );
    return subject;
  };
  const stream = selector(select);
  return {selects, stream};
}
