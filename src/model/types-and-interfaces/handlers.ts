import { Executor } from './executor';
import { Trigger } from './trigger';

export interface Handlers<T> {
  executor: Executor<T>;
  trigger?: Trigger<T>;
}
