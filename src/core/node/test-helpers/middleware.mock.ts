/* eslint-disable */
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { Update } from '../types-and-interfaces/update';
export class MockMiddlewareBuilder {
  public receivedFollowing: any;
  public receivedAction: Action | null = null;
  public receivedUpdate: Update<any> | null = null;
  public initialValue: any;
  public completedValue: any;
  public valueAtCreate: any = { fromMock: true };
  public createdMiddleware: any;

  public create(
    newAction?: Action,
    callNextAction?: Action,
    returnValue?: any
  ): Middleware {
    const t: MockMiddlewareBuilder = this as any;
    return (next: (action: Action) => Action, value: () => any) => {
      t.initialValue = value();
      return (following: (a: Action) => Action) => {
        t.receivedFollowing = following;
        t.createdMiddleware = (a: Action) => {
          if (callNextAction) {
            next(callNextAction);
          }
          t.receivedAction = a;
          if (newAction) {
            a = newAction;
          }
          if (returnValue) {
            return returnValue;
          }
          return following(a);
        };
        return t.createdMiddleware;
      };
    };
  }
}
