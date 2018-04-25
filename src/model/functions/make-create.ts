import { Mixin } from '../types-and-interfaces/mixin';
import { Middleware } from '../types-and-interfaces/middleware';
import { Middlewares } from '../types-and-interfaces/middlewares';
import { Emce } from '../types-and-interfaces/emce';
import { EmceFactory } from '../emce.factory';
import { Handlers } from '../types-and-interfaces/handlers';
import { Executor } from '../types-and-interfaces/executor';
export function makeCreate(mixins: Array<Mixin<any, any>>, middlewares: Array<Middleware | Middlewares>): <T>(executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => Emce<T> {
    return <T>(executorOrHandlers: Handlers<T> | Executor<T>, initial: T | null) => {
      const factory: EmceFactory = new EmceFactory(mixins, middlewares);
      return factory.createEmce(initial, executorOrHandlers);
  };
}
