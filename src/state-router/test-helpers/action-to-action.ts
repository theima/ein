import { Action } from '../../core';

export function actionToAction(last: { value: any }, call: { called: boolean }, returnVal?: {value: any}, callOnCall?: {call: () => void}) {
  return (a: Action): Action => {
    last.value = a;
    call.called = true;
    if (returnVal && returnVal.value !== undefined) {
      return returnVal.value as Action;
    }
    if (callOnCall && callOnCall.call) {
      callOnCall.call();
    }
    return a;
  };
}
