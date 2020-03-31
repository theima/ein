import { Observable } from 'rxjs';
import { Action, arrayToDict, Middleware, Stack } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { actionToAction } from '../../test-helpers/action-to-action';
import { MockCan } from '../../test-helpers/can.mock';
import { MockData } from '../../test-helpers/data.mock';
import { StateAction } from '../../types-and-interfaces/actions/state-action';
import { TransitionFailedAction } from '../../types-and-interfaces/actions/transition-failed.action';
import { TransitionPreventedAction } from '../../types-and-interfaces/actions/transition-prevented.action';
import { TransitionAction } from '../../types-and-interfaces/actions/transition.action';
import { TransitionedAction } from '../../types-and-interfaces/actions/transitioned.action';
import { TransitioningAction } from '../../types-and-interfaces/actions/transitioning.action';
import { StateDescriptor } from '../../types-and-interfaces/config/descriptor/state.descriptor';
import { Prevent } from '../../types-and-interfaces/config/prevent';
import { Reason } from '../../types-and-interfaces/config/reason';
import { routerMiddleware } from './router.middleware';

describe('Router middleware', () => {
  let states: StateDescriptor[];
  let appliedMiddleware: (action: Action) => Action;
  let lastResult: any;
  let followingCalled: any;
  let following: (action: Action) => Action;
  let lastNext: any;
  let nextCalled: any;
  let next: (action: Action) => Action;
  let returnValue: any = { a: 'a' };
  let value: () => any = () => {
    return returnValue;
  };
  let mockCanLeave: MockCan;
  let canLeave: (m: any) => Observable<boolean | Prevent>;
  let mockCanEnter: MockCan;
  let canEnter: (m: any) => Observable<boolean | Prevent | Action>;
  let mockRuleCanEnter: MockCan;
  let ruleCanEnter: (m: any) => Observable<boolean | Prevent | Action>;
  let mockDataOne: MockData;
  let mockDataTwo: MockData;
  let model: any;
  let sevenOneLeave: (m: any) => Observable<boolean | Prevent>;
  let mockSevenOneLeave: MockCan;
  let sevenLeave: (m: any) => Observable<boolean | Prevent>;
  let mockSevenLeave: MockCan;
  let mockEightEnter: MockCan;
  beforeEach(() => {
    mockCanLeave = new MockCan();
    canLeave = mockCanLeave.createCan();
    mockCanEnter = new MockCan();
    canEnter = mockCanEnter.createCan();
    mockRuleCanEnter = new MockCan();
    ruleCanEnter = mockRuleCanEnter.createCan();
    mockDataOne = new MockData();
    mockDataTwo = new MockData();
    mockSevenOneLeave = new MockCan();
    sevenOneLeave = mockSevenOneLeave.createCan();
    mockSevenLeave = new MockCan();
    sevenLeave = mockSevenLeave.createCan();
    mockEightEnter = new MockCan();
    mockEightEnter.createCan();
    states = [
      {
        name: 'first',
        rule: null,
        parent: null
      },
      {
        name: 'second',
        rule: null,
        parent: null,
        canLeave
      },
      {
        name: 'third',
        rule: null,
        parent: null,
        canEnter
      },
      {
        name: 'fourth',
        rule: null,
        parent: null
      },
      {
        name: 'fifth',
        rule: null,
        parent: null,
        data: {
          one: mockDataOne.createData(),
          two: mockDataTwo.createData()
        }
      },
      {
        name: 'sixth',
        rule: {
          id: 1,
          canEnter: ruleCanEnter,
          parent: null
        },
        parent: null,
        canEnter
      },
      {
        name: 'seventh',
        parent: null,
        rule: null,
        canLeave: sevenLeave
      },
      {
        name: 'seventh_one',
        parent: 'seventh',
        rule: null,
        canLeave: sevenOneLeave
      },
      {
        name: 'seventh_two',
        parent: 'seventh',
        rule: null
      },
      {
        name: 'eighth',
        parent: null,
        rule: null,
        canLeave: sevenLeave
      },
      {
        name: 'eighth_one',
        parent: 'eighth',
        rule: null
      }

    ];
    lastResult = { value: null };
    lastNext = { value: null };
    followingCalled = { called: false };
    nextCalled = { called: false };
    following = actionToAction(lastResult, followingCalled);
    next = actionToAction(lastNext, nextCalled);
    let middleware: Middleware = partial(routerMiddleware, arrayToDict('name', states));
    appliedMiddleware = middleware(next, value)(following);
  });
  describe('Transition', () => {
    it('Should returned transition failed for missing name', () => {
      appliedMiddleware({ type: StateAction.InitiateTransition } as any);
      const sent: TransitionFailedAction = lastNext.value as any;
      expect(nextCalled.called).toBeTruthy();
      expect(sent.type).toEqual(StateAction.TransitionFailed);
      expect(sent.reason).toEqual(Reason.NoStateName);
      expect(sent.code).toEqual(1);
    });
    it('Should return transition failed for missing state', () => {
      appliedMiddleware({
        type: StateAction.InitiateTransition,
        to: {
          name: 'missingState',
          params: {}
        }
      } as any);
      const sent: TransitionFailedAction = lastNext.value as any;
      expect(nextCalled.called).toBeTruthy();
      expect(sent.type).toEqual(StateAction.TransitionFailed);
      expect(sent.reason).toEqual(Reason.NoState);
      expect(sent.code).toEqual(2);
    });
    it('Should not send transition on to following', () => {
      appliedMiddleware({
        type: StateAction.InitiateTransition,
        to: {
          name: 'first',
          params: {}
        }
      } as any);
      expect(followingCalled.called).toBeFalsy();
    });
    it('Should send transitioning on next', () => {
      appliedMiddleware({
        type: StateAction.InitiateTransition,
        to: {
          name: 'first',
          params: {}
        }
      } as any);
      const sent: TransitioningAction = lastNext.value as any;
      expect(nextCalled.called).toBeTruthy();
      expect(sent.type).toEqual(StateAction.Transitioning);
      expect(sent.from).toBeUndefined();
      expect(sent.to).toEqual({ name: 'first', params: {} });
    });
    it('Should send transitioning with params', () => {
      const params: any = { d: 's' };
      appliedMiddleware({
        type: StateAction.InitiateTransition,
        to: {
          name: 'first',
          params
        }
      } as any);
      const sent: TransitioningAction = lastNext.value as any;
      expect(nextCalled.called).toBeTruthy();
      expect(sent.type).toEqual(StateAction.Transitioning);
      expect(sent.from).toBeUndefined();
      expect(sent.to).toEqual({ name: 'first', params });
    });

    describe('with canLeave defined', () => {

      beforeEach(() => {
        model = { mm: 'ss' };
        appliedMiddleware({
          type: StateAction.Transitioned,
          to: {
            name: 'second',
            params: {}
          },
          remainingStates: new Stack()
        } as any);

        returnValue = model;

        appliedMiddleware({
          type: StateAction.InitiateTransition,
          to: {
            name: 'first',
            params: {}
          }
        } as any);
      });

      it('Should call canLeave with current model', () => {
        expect(mockCanLeave.lastCalledWith).toBe(model);
      });
      it('Should send transition-prevented action if canLeave returns false', () => {
        mockCanLeave.returnData = false;
        mockCanLeave.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.from).toEqual({ name: 'second', params: {} });
      });
      it('Should send transition-prevented action with if canLeave returns a Prevent', () => {
        const reason: string = 'message';
        const code: number = 123;
        const prevent: Prevent = {
          reason,
          code
        };
        mockCanLeave.returnData = prevent;
        mockCanLeave.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.from).toEqual({ name: 'second', params: {} });
        expect(sent.reason).toEqual(reason);
        expect(sent.code).toEqual(code);
      });
      it('Should send transition-failed action if canLeave errors', () => {
        const error: any = {};
        mockCanLeave.errorValue = error;
        mockCanLeave.error();
        const sent: TransitionFailedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionFailed);
        expect(sent.from).toEqual({ name: 'second', params: {} });
        expect(sent.reason).toEqual(Reason.CanLeaveFailed);
        expect(sent.code).toEqual(7);
        expect(sent.error).toEqual(error);
      });
      it('Should send transitioning on next', () => {
        mockCanLeave.returnData = true;
        mockCanLeave.sendData();
        const sent: TransitioningAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.Transitioning);
        expect(sent.from).toEqual({ name: 'second', params: {} });
        expect(sent.to).toEqual({ name: 'first', params: {} });
      });
    });

    describe('with canEnter defined', () => {
      beforeEach(() => {
        model = { mm: 'tt' };
        returnValue = model;

        appliedMiddleware({
          type: StateAction.InitiateTransition,
          to: {
            name: 'third',
            params: {}
          }
        } as any);
      });
      it('Should call canEnter with current model', () => {
        expect(mockCanEnter.lastCalledWith).toBe(model);
      });
      it('Should send transition-prevented action if canEnter returns false', () => {
        mockCanEnter.returnData = false;
        mockCanEnter.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.to).toEqual({ name: 'third', params: {} });
      });
      it('Should send transition-prevented action with if canEnter returns a Prevent', () => {
        const reason: string = 'message';
        const code: number = 123;
        const prevent: Prevent = {
          reason,
          code
        };
        mockCanEnter.returnData = prevent;
        mockCanEnter.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.to).toEqual({ name: 'third', params: {} });
        expect(sent.reason).toEqual(reason);
        expect(sent.code).toEqual(code);
      });
      it('Should call next with the  action returned from canEnter', () => {
        const a: Action = { type: 'new' };
        mockCanEnter.returnData = a;
        mockCanEnter.sendData();
        const sent: Action = lastNext.value as any;
        expect(sent).toBe(a);
      });
      it('Should send transition-failed action if canEnter errors', () => {
        const error: any = {};
        mockCanEnter.errorValue = error;
        mockCanEnter.error();
        const sent: TransitionFailedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionFailed);
        expect(sent.to).toEqual({ name: 'third', params: {} });
        expect(sent.reason).toEqual(Reason.CanEnterFailed);
        expect(sent.code).toEqual(8);
        expect(sent.error).toEqual(error);
      });
      it('Should send transitioning on next', () => {
        mockCanEnter.returnData = true;
        mockCanEnter.sendData();
        const sent: TransitioningAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.Transitioning);
        expect(sent.to).toEqual({ name: 'third', params: {} });
      });
    });
    describe('with rules', () => {
      beforeEach(() => {
        model = { mm: 'tt' };
        returnValue = model;

        appliedMiddleware({
          type: StateAction.InitiateTransition,
          to: {
            name: 'sixth',
            params: {}
          }
        } as any);
      });
      it('Should brake on rule prevent', () => {
        const reason: string = 'message';
        const code: number = 123;
        const prevent: Prevent = {
          reason,
          code
        };
        mockRuleCanEnter.returnData = prevent;
        mockRuleCanEnter.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.to).toEqual({ name: 'sixth', params: {} });
        expect(sent.reason).toEqual(reason);
        expect(sent.code).toEqual(code);
      });
      it('Should brake on rule false', () => {
        mockRuleCanEnter.returnData = false;
        mockRuleCanEnter.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.to).toEqual({ name: 'sixth', params: {} });
      });
      it('Should call canEnter on state after rule', () => {
        mockRuleCanEnter.returnData = true;
        mockRuleCanEnter.sendData();
        expect(mockCanEnter.wasCalled).toBeTruthy();
      });
    });
    describe('with both canEnter and canLeave defined', () => {
      beforeEach(() => {
        model = { mm: 'gg' };
        appliedMiddleware({
          type: StateAction.Transitioned,
          to: {
            name: 'second',
            params: {}
          },
          remainingStates: new Stack()
        } as any);

        returnValue = model;

        appliedMiddleware({
          type: StateAction.InitiateTransition,
          to: {
            name: 'third',
            params: {}
          }
        } as any);
      });

      it('Should call canLeave with current model', () => {
        expect(mockCanLeave.lastCalledWith).toBe(model);
      });
      it('Should send transition-prevented action if canLeave returns false', () => {
        mockCanLeave.returnData = false;
        mockCanLeave.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.from).toEqual({ name: 'second', params: {} });
      });
      it('Should send transition-prevented action with if canLeave returns a Prevent', () => {
        const reason: string = 'message';
        const code: number = 123;
        const prevent: Prevent = {
          reason,
          code
        };
        mockCanLeave.returnData = prevent;
        mockCanLeave.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.from).toEqual({ name: 'second', params: {} });
        expect(sent.reason).toEqual(reason);
        expect(sent.code).toEqual(code);
      });
      it('Should call canEnter with current model', () => {
        expect(mockCanEnter.lastCalledWith).toBe(model);
      });
      it('Should send transition-prevented action if canEnter returns false', () => {
        mockCanLeave.returnData = true;
        mockCanLeave.sendData();
        mockCanEnter.returnData = false;
        mockCanEnter.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.to).toEqual({ name: 'third', params: {} });
      });
      it('Should send transition-prevented action with if canEnter returns a Prevent', () => {
        const reason: string = 'message';
        const code: number = 123;
        const prevent: Prevent = {
          reason,
          code
        };
        mockCanLeave.returnData = true;
        mockCanLeave.sendData();
        mockCanEnter.returnData = prevent;
        mockCanEnter.sendData();
        const sent: TransitionPreventedAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.TransitionPrevented);
        expect(sent.to).toEqual({ name: 'third', params: {} });
        expect(sent.reason).toEqual(reason);
        expect(sent.code).toEqual(code);
      });
      it('Should call next with the  action returned from canEnter', () => {
        mockCanLeave.returnData = true;
        mockCanLeave.sendData();
        const a: Action = { type: 'new' };
        mockCanEnter.returnData = a;
        mockCanEnter.sendData();
        const sent: Action = lastNext.value as any;
        expect(sent).toBe(a);
      });
      it('Should send transitioning on next', () => {
        mockCanLeave.returnData = true;
        mockCanLeave.sendData();
        mockCanEnter.returnData = true;
        mockCanEnter.sendData();
        const sent: TransitioningAction = lastNext.value as any;
        expect(sent.type).toEqual(StateAction.Transitioning);
        expect(sent.from).toEqual({ name: 'second', params: {} });
        expect(sent.to).toEqual({ name: 'third', params: {} });
      });
    });

  });
  describe('Transitioning', () => {
    let params: any;
    beforeEach(() => {
      appliedMiddleware({
        type: StateAction.Transitioned,
        to: {
          name: 'first',
          params: {}
        },
        remainingStates: new Stack()
      } as any);
      params = {
        a: 'll'
      };
    });
    describe('Without Data', () => {
      beforeEach(() => {
        appliedMiddleware({
          type: StateAction.Transitioning,
          to: {
            name: 'fourth',
            params
          },
          from: {
            name: 'first',
            params: {}
          },
          remainingStates: new Stack()
        } as any);
      });
      it('Should send transitioned', () => {
        const sent: TransitionedAction = lastNext.value as any;
        expect(nextCalled).toBeTruthy();
        expect(sent.type).toEqual(StateAction.Transitioned);
        expect(sent.from).toEqual({ name: 'first', params: {} });
        expect(sent.to).toEqual({ name: 'fourth', params });
      });
    });
    describe('With Data', () => {
      let dataA = { kdk: 'aa' };
      let dataB = { kdk: 'bb' };
      beforeEach(() => {
        mockDataOne.returnValue = dataA;
        mockDataTwo.returnValue = dataB;
        appliedMiddleware({
          type: StateAction.Transitioning,
          to: {
            name: 'fifth',
            params
          },
          from: {
            name: 'first',
            params: {}
          },
          remainingStates: new Stack()
        } as any);
      });

      it('Should retrieve all data defined', () => {
        mockDataOne.sendData();
        mockDataTwo.sendData();
        const sent: TransitionedAction = lastNext.value as any;
        expect(nextCalled).toBeTruthy();
        expect(sent.type).toEqual(StateAction.Transitioned);
        expect(sent.from).toEqual({ name: 'first', params: {} });
        expect(sent.to).toEqual({ name: 'fifth', params });
        expect(sent.data).toEqual({ one: dataA, two: dataB });
      });
      it('Should return transition failed if any data errors', () => {
        const error: any = { aa: 'aa' };
        mockDataOne.errorValue = error;
        mockDataOne.error();
        mockDataTwo.sendData();
        const sent: TransitionFailedAction = lastNext.value as any;
        expect(nextCalled).toBeTruthy();
        expect(sent.type).toEqual(StateAction.TransitionFailed);
        expect(sent.from).toEqual({ name: 'first', params: {} });
        expect(sent.to).toEqual({ name: 'fifth', params });
        expect(sent.reason).toEqual(Reason.CouldNotLoadData);
        expect(sent.code).toEqual(3);
      });
    });
    describe('with children', () => {
      describe('entering', () => {
        it('should first transition to parent', () => {
          appliedMiddleware({
            type: StateAction.InitiateTransition,
            to: {
              name: 'seventh_one',
              params: {}
            }
          } as any);
          const sent: TransitioningAction = lastNext.value as any;
          expect(sent.type).toEqual(StateAction.Transitioning);
          expect(sent.to).toEqual({ name: 'seventh', params: {} });
        });
        it('should not call can leave for parent when moving to child', () => {
          appliedMiddleware({
            type: StateAction.InitiateTransition,
            to: {
              name: 'seventh_one',
              params: {}
            }
          } as any);
          appliedMiddleware({
            type: StateAction.Transitioned,
            to: { name: 'seventh', params: {} },
            remainingStates: new Stack()
          } as any);
          const newA: TransitionAction = lastNext.value as any;
          appliedMiddleware({ ...newA, type: StateAction.InitiateTransition } as any);
          expect(mockSevenLeave.wasCalled).toBeFalsy();
        });
        it('should not transition to parent when moving to sibling', () => {
          appliedMiddleware({
            type: StateAction.Transitioned,
            to: { name: 'seventh_one', params: {} },
            remainingStates: new Stack()
          } as any);
          appliedMiddleware({
            type: StateAction.InitiateTransition,
            to: {
              name: 'seventh_two',
              params: {}
            }
          } as any);
          mockSevenOneLeave.returnData = true;
          mockSevenOneLeave.sendData();
          const sent: TransitioningAction = lastNext.value as any;
          expect(sent.type).toEqual(StateAction.Transitioning);
          expect(sent.to).toEqual({ name: 'seventh_two', params: {} });
        });
        it('should not call canEnter on parent when moving from child', () => {
          // nya states för detta så vi kan använda bara en can enter
          appliedMiddleware({
            type: StateAction.Transitioned,
            to: { name: 'eighth_one', params: {} },
            remainingStates: new Stack()
          } as any);
          appliedMiddleware({
            type: StateAction.InitiateTransition,
            to: {
              name: 'eighth',
              params: {}
            }
          } as any);
          expect(mockEightEnter.wasCalled).toBeFalsy();
        });
      });
      describe('leaving', () => {
        it('should call all can leave on transition', () => {
          appliedMiddleware({
            type: StateAction.Transitioned,
            to: { name: 'seventh_one', params: {} },
            remainingStates: new Stack()
          } as any);
          appliedMiddleware({
            type: StateAction.InitiateTransition,
            to: {
              name: 'first',
              params: {}
            }
          } as any);
          mockSevenLeave.returnData = true;
          mockSevenOneLeave.returnData = true;
          mockSevenLeave.sendData();
          mockSevenOneLeave.sendData();
          expect(mockSevenLeave.wasCalled).toBeTruthy();
          expect(mockSevenOneLeave.wasCalled).toBeTruthy();
        });
        it('should not call parent can leave when moving to sibling', () => {
          appliedMiddleware({
            type: StateAction.Transitioned,
            to: { name: 'seventh_one', params: {} },
            remainingStates: new Stack()
          } as any);
          appliedMiddleware({
            type: StateAction.InitiateTransition,
            to: {
              name: 'seventh_two',
              params: {}
            }
          } as any);
          mockSevenLeave.returnData = true;
          mockSevenOneLeave.returnData = true;
          mockSevenLeave.sendData();
          mockSevenOneLeave.sendData();
          expect(mockSevenLeave.wasCalled).toBeFalsy();
          expect(mockSevenOneLeave.wasCalled).toBeTruthy();
        });
      });

    });
  });
});
