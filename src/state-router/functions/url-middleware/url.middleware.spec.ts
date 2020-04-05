import { Action, arrayToDict, Middleware, Stack } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { actionToAction } from '../../test-helpers/action-to-action';
import { StateAction } from '../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../types-and-interfaces/actions/transition-failed.action';
import { Reason } from '../../types-and-interfaces/config/reason';
import { StateConfig } from '../../types-and-interfaces/config/state.config';
import { createStateDescriptors } from '../initiate-router/create-state-descriptors';
import { urlMiddleware } from './url.middleware';

describe('Url middleware', () => {
  let states: StateConfig[];
  let appliedMiddleware: (action: Action) => Action;
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
    const setState = () => {/* */};
    const descriptors = createStateDescriptors(states);
    let middleware: Middleware = partial(urlMiddleware, arrayToDict('name', descriptors) as any, setUrl, setState);
    appliedMiddleware = middleware(next, value)(following);
  });
  it('Should call set url when transitioned is finished', () => {
    appliedMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {id: 1}
      },
      remainingStates: new Stack()

    } as any);
    expect(seturlCalled).toBeTruthy();
  });
  it('Should send error for missing params', () => {
    appliedMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {}
      },
      remainingStates: new Stack()
    } as any);
    const sent: TransitionFailedAction = lastNext.value as any;
    expect(nextCalled.called).toBeTruthy();
    expect(sent.type).toEqual(StateAction.TransitionFailed);
    expect(sent.reason).toEqual(Reason.CouldNotBuildUrl);
    expect(sent.code).toEqual(4);
  });
  it('Should send error for bad params', () => {
    appliedMiddleware({
      type: StateAction.Transitioned,
      to: {
        name: 'second',
        params: {id: [1, 2, 3]}
      },
      remainingStates: new Stack()
    } as any);
    const sent: TransitionFailedAction = lastNext.value as any;
    expect(nextCalled.called).toBeTruthy();
    expect(sent.type).toEqual(StateAction.TransitionFailed);
    expect(sent.reason).toEqual(Reason.CouldNotBuildUrl);
    expect(sent.code).toEqual(4);
  });

});
