import { Action } from '../types-and-interfaces/action';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';
export function execute<T>(handlers: Handlers<T>): Executor<T> {
  let execute: (model: T | null, action: Action) => T = handlers.executor;
  return (model: T | null, action: Action) => {
    if (model === undefined) {
      model = null;
    }
    return execute(model, action);
  };
}
