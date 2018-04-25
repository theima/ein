import { Action } from './action';
import { Middleware } from './middleware';
import { TriggerMiddleWare } from './trigger-middleware';
export class MockMiddlewareBuilder {
  public recievedFollowing: any;
  public recievedAction: Action | null = null;
  public initialValue: any;
  public completedValue: any;
  public valueAtCreate: any = {fromMock: true};
  public createdMiddleware: any;

  public create(newAction?: Action, callNextAction?: Action, returnValue?: any): Middleware {
    //tslint:disable-next-line
    const t: MockMiddlewareBuilder = this;
    return (next: (action: Action) => Action, value: () => any) => {
      t.initialValue = value();
      return (following: (a: Action) => Action) => {
        t.recievedFollowing = following;
        t.createdMiddleware = (a: Action) => {
          if (callNextAction) {
            next(callNextAction);
          }
          t.recievedAction = a;
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

  public createTrigger(newAction?: Action, dontCallFollowing?: boolean): TriggerMiddleWare {
    //tslint:disable-next-line
    const t: MockMiddlewareBuilder = this;
    return (value: () => any) => {
      t.valueAtCreate = value();
      return (following: (action: Action) => void) => {
        t.recievedFollowing = following;
        t.createdMiddleware = (a: Action) => {
          t.initialValue = value();
          t.recievedAction = a;
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
