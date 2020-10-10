/* eslint-disable */
import { MockNodeSubject } from '../node-behavior-subject.mock';
import { MockMiddlewareBuilder } from '../test-helpers/middleware.mock';
import { Action } from '../types-and-interfaces/action';
import { chainMiddleware } from './chain-middleware';
import Spy = jasmine.Spy;
describe('chainMiddleware', () => {
  let mockNode: MockNodeSubject;
  let middlewareA: MockMiddlewareBuilder;
  let middlewareB: MockMiddlewareBuilder;
  let middlewares: any[];
  let chained: (m: any, a: any) => any;
  let last: (a: any) => any;

  beforeEach(() => {
    mockNode = new MockNodeSubject({}, {});
    middlewareA = new MockMiddlewareBuilder();
    middlewareB = new MockMiddlewareBuilder();
    last = (a: any) => {
      return a;
    };
  });

  const chain: () => void = () => {
    chained = chainMiddleware(mockNode as any, last, middlewares);
  };

  const create: () => void = () => {
    middlewares = [
      middlewareA.create(),
      middlewareB.create()];
    chain();
  };

  const createWithCustomAction: (a: Action) => void = (a: Action) => {
    middlewares = [
      middlewareA.create(a),
      middlewareB.create()];
    chain();
  };

  const createWithCallNextAction: (a: Action) => void = (a: Action) => {
    middlewares = [
      middlewareA.create(undefined, a),
      middlewareB.create()];
    chain();
  };

  it('should get next added as following', () => {
    create();
    expect(middlewareA.receivedFollowing).toBe(middlewareB.createdMiddleware);
  });

  it('should send the action from previous to following', () => {
    const action: Action = {type: 'aa'};
    createWithCustomAction(action);
    chained({}, {type: 'a'});
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
    chained({}, {type: 'a'});
    expect(spy).toHaveBeenCalled();
  });
  it('should call next on node with correct `this`', () => {
    const nextAction: Action = {type: 'b'};
    createWithCallNextAction(nextAction);
    chained({}, {type: 'a'});
    expect(mockNode.lastNextCalledWith).toBe(nextAction);
  });

});
