import { Node } from '../types-and-interfaces/node';
import { makeCreate } from './make-create';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';

export const create: <T>(executorOrHandlers: Handlers<T> | Executor<T>,
                         initial: T | null) => Node<T> = makeCreate([], []);
