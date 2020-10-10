/* eslint-disable */
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';
export class MockMiddlewareBuilder {
  public receivedFollowing: any;
  public receivedAction: Action | null = null;
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

  public createTrigger(
    newAction?: Action,
    dontCallFollowing?: boolean
  ): TriggerMiddleWare {
    const t: MockMiddlewareBuilder = this as any;
    return (value: () => any) => {
      t.valueAtCreate = value();
      return (following: (action: Action) => void) => {
        t.receivedFollowing = following;
        t.createdMiddleware = (a: Action) => {
          t.initialValue = value();
          t.receivedAction = a;
          if (newAction) {
            a = newAction;
          }
          if (!dontCallFollowing) {
            const result = following(a);
            t.completedValue = value();
            return result;
          }
        };
        return t.createdMiddleware;
      };
    };
  }
}
