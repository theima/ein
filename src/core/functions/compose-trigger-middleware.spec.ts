import { composeTriggerMiddleware } from './compose-trigger-middleware';
import { MockMiddlewareBuilder } from '../middleware.mock';
import { Action } from '../types-and-interfaces/action';

describe('composeTriggerMiddleware', () => {
  let middlewareA: MockMiddlewareBuilder;
  let middlewareB: MockMiddlewareBuilder;
  let middlewares: any[];
  let composed: (model: any, a: any) => void;
  let lastCalled: boolean;
  let last: (m: any, a: any) => any;
  let returnValueForLast: any;

  beforeEach(() => {
    middlewareA = new MockMiddlewareBuilder();
    middlewareB = new MockMiddlewareBuilder();
    lastCalled = false;
    returnValueForLast = null;
    last = (m: any, a: any) => {
      lastCalled = true;
      if (returnValueForLast) {
        return returnValueForLast;
      }
      return m;
    };
  });

  const compose: () => void = () => {
    composed = composeTriggerMiddleware(last, middlewares);
  };

  const create: () => void = () => {
    middlewares = [
      middlewareA.createTrigger(),
      middlewareB.createTrigger()];
    compose();
  };

  const createWithCustomAction: (a: Action) => void = (a: Action) => {
    middlewares = [
      middlewareA.createTrigger(a),
      middlewareB.createTrigger()];
    compose();
  };

  const createWithStopAtA: () => void = () => {
    middlewares = [
      middlewareA.createTrigger(undefined, true),
      middlewareB.createTrigger()];
    compose();
  };

  it('should get next added as following', () => {
    create();
    expect(middlewareA.recievedFollowing).toBe(middlewareB.createdMiddleware);
  });

  it('should give last added as following for last in list.', () => {
    create();
    middlewareB.recievedFollowing({}, {});
    expect(lastCalled).toBeTruthy();
  });

  it('should send the action from previous to following', () => {
    const action: Action = {type: 'aa'};
    createWithCustomAction(action);
    composed({}, {type: 'a'});
    expect(middlewareB.recievedAction).toBe(action);
  });

  it('should have current value', () => {
    create();
    const value: any = {a: 'a'};
    composed(value, {type: 'aa'});
    expect(middlewareA.initialValue).toEqual(value);
  });

  it('should have updated value', () => {
    create();
    const value: any = {a: 'a'};
    returnValueForLast = value;
    composed({}, {type: 'aa'});
    expect(middlewareA.completedValue).toEqual(value);
  });
  it('should have updated value for second call.', () => {
    create();
    const value: any = {a: 'a'};
    composed({}, {type: 'aa'});
    returnValueForLast = value;
    composed({}, {type: 'aa'});
    expect(middlewareA.completedValue).toEqual(value);
  });

  it('should return updated model', () => {
    create();
    const value: any = {a: 'a'};
    returnValueForLast = value;
    const returned = composed({}, {type: 'aa'});
    expect(returned).toEqual(value);
  });

  it('should return unchanged model if middleware doesn\'t call following', () => {
    createWithStopAtA();
    const value: any = {a: 'a'};
    const returned = composed(value, {type: 'aa'});
    expect(returned).toEqual(value);
  });
  it('should return null from value when creating middleware.', () => {
    create();
    expect(middlewareA.valueAtCreate).toBeNull();
  });
});
