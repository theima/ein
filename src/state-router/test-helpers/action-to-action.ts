import { Action } from '../../core';

export function actionToAction(last: { value: any }, call: { called: boolean }, returnval?: {value: any}, callOnCall?: {call: () => void}) {
  return (a: Action) => {
    last.value = a;
    call.called = true;
    if (returnval && returnval.value !== undefined) {
      return returnval.value;
    }
    if (callOnCall && callOnCall.call) {
      callOnCall.call();
    }
    return a;
  };
}
