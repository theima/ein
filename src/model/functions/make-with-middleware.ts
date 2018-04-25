import { Mixin } from '../types-and-interfaces/mixin';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Emce } from '../types-and-interfaces/emce';
import { EmceConstructor } from '../types-and-interfaces/emce-constructor';
import { makeCreate } from './make-create';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '..';

export function makeWithMiddleware<T, E extends Emce<T>, EBase extends EmceConstructor<E>>(mixins: Array<Mixin<E, EBase>>) {
  return <T>(...middleware: Array<Middleware | Middlewares>): {
    create: (executorOrHandlers: Executor<T> | Handlers<T>, initial: T | null) => Emce<T>
  } => {
    return {
      create: makeCreate(mixins, middleware)
    };
  };
}
