import { Emce } from '../types-and-interfaces/emce';
import { makeCreate } from './make-create';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';

export const create: <T>(executorOrHandlers: Handlers<T> | Executor<T>,
                         initial: T | null) => Emce<T> = makeCreate([], []);
