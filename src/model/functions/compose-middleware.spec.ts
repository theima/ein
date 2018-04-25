import { MockMiddlewareBuilder } from '../types-and-interfaces/middleware.mock';
import { Action } from '../types-and-interfaces/action';
import { composeMiddleware } from './compose-middleware';
import Spy = jasmine.Spy;
import { MockEmceSubject } from '../emce-subject.mock';

describe('composeMiddleware', () => {
  let mockEmce: MockEmceSubject;
  let middlewareA: MockMiddlewareBuilder;
  let middlewareB: MockMiddlewareBuilder;
  let middlewares: any[];
  let composed: (m: any, a: any) => any;
  let last: (a: any) => any;

  beforeEach(() => {
    mockEmce = new MockEmceSubject({}, {});
    middlewareA = new MockMiddlewareBuilder();
    middlewareB = new MockMiddlewareBuilder();
    last = (a: any) => {
      return a;
    };
  });

  const compose: () => void = () => {
    composed = composeMiddleware(mockEmce as any, last, middlewares);
  };

  const create: () => void = () => {
    middlewares = [
      middlewareA.create(),
      middlewareB.create()];
    compose();
  };

  const createWithCustomAction: (a: Action) => void = (a: Action) => {
    middlewares = [
      middlewareA.create(a),
      middlewareB.create()];
    compose();
  };

  const createWithCallNextAction: (a: Action) => void = (a: Action) => {
    middlewares = [
      middlewareA.create(null, a),
      middlewareB.create()];
    compose();
  };

  it('should get next added as following', () => {
    create();
    expect(middlewareA.recievedFollowing).toBe(middlewareB.createdMiddleware);
  });

  it('should give last added as following for last in list.', () => {
    create();

    expect(middlewareB.recievedFollowing).toBe(last);
  });

  it('should send the action from previous to following', () => {
    const action: Action = {type: 'aa'};
    createWithCustomAction(action);
    composed({}, {type: 'a'});
    expect(middlewareB.recievedAction).toBe(action);
  });
  it('should get value', () => {
    const value: any = {a: 'dd'};
    mockEmce.valueToReturn = value;
    create();
    expect(value).toEqual(middlewareA.initialValue);
  });
  it('should call next on emce', () => {
    const spy: Spy = spyOn(mockEmce, 'next');
    createWithCallNextAction({type: 'b'});
    expect(spy).not.toHaveBeenCalled();
    composed({}, {type: 'a'});
    expect(spy).toHaveBeenCalled();
  });
  it('should call next on emce with correct `this`', () => {
    const nextAction: Action = {type: 'b'};
    createWithCallNextAction(nextAction);
    composed({}, {type: 'a'});
    expect(mockEmce.lastNextCalledWith).toBe(nextAction);
  });

});
