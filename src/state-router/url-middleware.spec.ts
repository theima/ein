import { actionToAction } from './test-helpers/action-to-action';
import { createUrlMiddleware } from './create-url-middleware';
import { PathConfig } from './types-and-interfaces/path.config';
import { Reason } from './types-and-interfaces/reason';
import { StateAction } from './types-and-interfaces/state-action';
import { TransitionFailedAction } from './types-and-interfaces/transition-failed.action';
import { Action, Middleware } from '../model';
import { arrayToDict } from '../core';

describe('Url middleware', () => {
  let states: PathConfig[];
  let urlMiddleware: (action: Action) => Action;
  let lastFollowing: any;
  let followingCalled: any;
  let followingReturnValue: any;
  let followingCall: any;
  let following: (action: Action) => Action;
  let lastNext: any;
  let nextCalled: any;
  let next: (action: Action) => Action;
  let returnValue: any = {a: 'a'};
  const value: () => any = () => {
    return returnValue;
  };
  let seturlCalled: boolean;
  const setUrl: (path: string) => void = (path: string) => {
    seturlCalled = true;
  };
  beforeEach(() => {
    seturlCalled = false;
    states = [
      {name: 'first'} as any,
      {
        name: 'second',
        path: 'path/:id'
      }];
    lastFollowing = {value: null};
    lastNext = {value: null};
    followingCalled = {called: false};
    followingReturnValue = {};
    followingCall = {
      call: () => {
        return null;
      }
    };
    nextCalled = {called: false};
    following = actionToAction(lastFollowing, followingCalled, followingReturnValue, followingCall);
    next = actionToAction(lastNext, nextCalled);
    let middleware: Middleware = createUrlMiddleware(arrayToDict('name', states), setUrl);
    urlMiddleware = middleware(next, value)(following);
  });
  it('Should send error for missing path map', () => {
    urlMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'first',
        params: {}
      }
    } as any);
    const sent: TransitionFailedAction = lastNext.value as any;
    expect(nextCalled.called).toBeTruthy();
    expect(sent.type).toEqual(StateAction.TransitionFailed);
    expect(sent.reason).toEqual(Reason.NoPathMap);
    expect(sent.code).toEqual(5);
  });
  it('Should send error for missing params', () => {
    urlMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {}
      }
    } as any);
    const sent: TransitionFailedAction = lastNext.value as any;
    expect(nextCalled.called).toBeTruthy();
    expect(sent.type).toEqual(StateAction.TransitionFailed);
    expect(sent.reason).toEqual(Reason.CouldNotBuildUrl);
    expect(sent.code).toEqual(4);
  });
  it('Should send error for bad params', () => {
    urlMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {id: [1, 2, 3]}
      }
    } as any);
    const sent: TransitionFailedAction = lastNext.value as any;
    expect(nextCalled.called).toBeTruthy();
    expect(sent.type).toEqual(StateAction.TransitionFailed);
    expect(sent.reason).toEqual(Reason.CouldNotBuildUrl);
    expect(sent.code).toEqual(4);
  });
  it('Should call set url when transitioned is returned from following', () => {
    followingCall.call = () => {
      expect(seturlCalled).toBeFalsy();
    };
    urlMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {id: 1}
      }
    } as any);
    expect(seturlCalled).toBeTruthy();
  });
  it('Should not call set url when action returned from following doesn\'t contain url', () => {
    followingReturnValue.value = {
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {id: 1}
      }
    };
    urlMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {id: 1}
      }
    } as any);
    expect(seturlCalled).toBeFalsy();
  });
});