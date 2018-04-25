import { Executor } from '../types-and-interfaces/executor';
import { SubExecutorMap } from './sub-executor-map';
import { give } from './give';
import { get } from '../../core';
import { Action } from '../types-and-interfaces/action';

export function mergeExecutors<T>(executors: SubExecutorMap): Executor<T>;
export function mergeExecutors<T>(executor: Executor<T>, executors: SubExecutorMap): Executor<T>;
export function mergeExecutors<T>(executorOrMap: Executor<T> | SubExecutorMap, executors?: SubExecutorMap): Executor<T> {
  let executor: Executor<T>;
  const subExecutors: SubExecutorMap = executors ? executors : executorOrMap as any;
  if (typeof executorOrMap === 'function') {
    executor = executorOrMap;
  }
  let keys: string[] = Object.keys(subExecutors);
  return (model: T | null, action: Action) => {
    let result: T = {} as any;
    if (executor) {
      model = executor(model, action);
    }
    let subModelChanged: boolean = false;
    keys.forEach((key) => {
      const subExecutor: Executor<any> = subExecutors[key];
      const subModel: any = get(model, key);
      const subResult: any = subExecutor(subModel, action);
      subModelChanged = subModelChanged || subModel !== subResult;
      result = give(result, subResult, key);
    });

    return subModelChanged ? result : model as T;
  };
}
