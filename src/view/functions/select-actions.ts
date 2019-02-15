import { Observable, Subject } from 'rxjs/index';
import { ActionSelect } from '../types-and-interfaces/action-select';
import { createSelector } from './create-selector';
import { Select } from '../types-and-interfaces/select';
import { Action } from '../../core';

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
