import { Observable, Subject } from 'rxjs/index';
import { Action } from '../../../../../core';
import { ActionSelect } from '../../../../types-and-interfaces/select-action/action-select';
import { Select } from '../../../../types-and-interfaces/select-action/select';
import { stringToSelector } from './string-to-selector';

export function createSelectors(toActionStream: (select: Select) => Observable<Action>): { selects: ActionSelect[], stream: Observable<Action> } {
  let selects: ActionSelect[] = [];
  const select: Select = (selector: string, type: string) => {
    const subject: Subject<Action> = new Subject<Action>();
    selects.push(
      {
        subject,
        selector: stringToSelector(selector),
        type
      }
    );
    return subject;
  };
  const stream = toActionStream(select);
  return {selects, stream};
}
