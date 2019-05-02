import { MockMiddlewareBuilder } from '../middleware.mock';
import { Action } from '../types-and-interfaces/action';
import { composeMiddleware } from './compose-middleware';
import Spy = jasmine.Spy;
import { MockNodeSubject } from '../node-behavior-subject.mock';

describe('composeMiddleware', () => {
  let mockNode: MockNodeSubject;
  let middlewareA: MockMiddlewareBuilder;
  let middlewareB: MockMiddlewareBuilder;
  let middlewares: any[];
  let composed: (m: any, a: any) => any;
  let last: (a: any) => any;

  beforeEach(() => {
    mockNode = new MockNodeSubject({}, {});
    middlewareA = new MockMiddlewareBuilder();
    middlewareB = new MockMiddlewareBuilder();
    last = (a: any) => {
      return a;
    };
  });

  const compose: () => void = () => {
    composed = composeMiddleware(mockNode as any, last, middlewares);
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
      middlewareA.create(undefined, a),
      middlewareB.create()];
    compose();
  };

  it('should get next added as following', () => {
    create();
    expect(middlewareA.receivedFollowing).toBe(middlewareB.createdMiddleware);
  });

  it('should give last added as following for last in list.', () => {
    create();

    expect(middlewareB.receivedFollowing).toBe(last);
  });

  it('should send the action from previous to following', () => {
    const action: Action = {type: 'aa'};
    createWithCustomAction(action);
    composed({}, {type: 'a'});
    expect(middlewareB.receivedAction).toBe(action);
  });
  it('should get value', () => {
    const value: any = {a: 'dd'};
    mockNode.valueToReturn = value;
    create();
    expect(value).toEqual(middlewareA.initialValue);
  });
  it('should call next on node', () => {
    const spy: Spy = spyOn(mockNode, 'next');
    createWithCallNextAction({type: 'b'});
    expect(spy).not.toHaveBeenCalled();
    composed({}, {type: 'a'});
    expect(spy).toHaveBeenCalled();
  });
  it('should call next on node with correct `this`', () => {
    const nextAction: Action = {type: 'b'};
    createWithCallNextAction(nextAction);
    composed({}, {type: 'a'});
    expect(mockNode.lastNextCalledWith).toBe(nextAction);
  });

});
