import { Executor } from '../types-and-interfaces/executor';
import { mergeExecutors } from './merge-executors';
import { MockExecutorBuilder } from '../types-and-interfaces/executor.mock';

describe('mergeExecutors', () => {
  interface Model {
    one: any;
    two: any;
  }

  let executor: Executor<any>;
  let child1Executor: Executor<any>;
  let child2Executor: Executor<any>;
  let executorBuilder1: MockExecutorBuilder;
  let executorBuilder2: MockExecutorBuilder;
  let model: Model;
  beforeEach(() => {
    executorBuilder1 = new MockExecutorBuilder();
    child1Executor = executorBuilder1.createHandlers().executor;
    executorBuilder2 = new MockExecutorBuilder();
    child2Executor = executorBuilder2.createHandlers().executor;
    executor = mergeExecutors({one: child1Executor, two: child2Executor});
    model = {
      one: {name: 'a'},
      two: {name: 'b'}
    };
  });
  it('should return unchanged model if no child changes it', () => {
    let result = executor(model, {type: 'a'});
    expect(result).toBe(model);
  });
  it('should send correct submodel to executor', () => {
    executor(model, {type: 'a'});
    expect(executorBuilder1.lastModelForExecutor).toBe(model.one);
  });
  it('should set correct submodel', () => {
    let subModel = {name: 'aa'};
    executorBuilder1.returnValue = subModel;
    let result = executor(model, {type: 'a'});
    expect(result.one).toBe(subModel);
  });
  it('should send \'null\' if no submodel exists', () => {
    model = {
      two: {name: 'b'}
    } as any;
    executor(model, {type: 'a'});
    expect(executorBuilder1.lastModelForExecutor).toBeNull();
  });
  describe('With root executor', () => {
    let rootBuilder: MockExecutorBuilder;
    let rootExecutor: Executor<any>;
    beforeEach(() => {
      rootBuilder = new MockExecutorBuilder();
      rootExecutor = rootBuilder.createHandlers().executor;
      executor = mergeExecutors(rootExecutor, {one: child1Executor, two: child2Executor});
    });
    it('should call child with result from root.', () => {
      let rootModelResult = {
        one: {name: 'a1'},
        two: {name: 'b1'}
      };
      rootBuilder.returnValue = rootModelResult;
      executor(model, {type: 'a'});
      expect(executorBuilder1.lastModelForExecutor).toBe(rootModelResult.one);
    });
    it('should return changed model if changed, but not by sub executors', () => {
      let rootModelResult = {
        one: {name: 'a1'},
        two: {name: 'b1'}
      };
      rootBuilder.returnValue = rootModelResult;
      let result = executor(model, {type: 'a'});
      expect(result).toBe(rootModelResult);
    });
  });
});
