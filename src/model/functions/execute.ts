import { Action } from '../types-and-interfaces/action';
import { Handlers } from '../types-and-interfaces/handlers';

export function execute<T>(handlers: Handlers<T>, model: T | null, action: Action): T {
  let execute: (model: T | null, action: Action) => T = handlers.executor;
  if (model === undefined) {
    model = null;
  }
  return execute(model, action);
}
