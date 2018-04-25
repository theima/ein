import { Executor } from '../types-and-interfaces/executor';

export interface SubExecutorMap {
  [key: string]: Executor<any>;
}
