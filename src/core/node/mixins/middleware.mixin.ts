import { chainMiddleware } from '../functions/chain-middleware';
import { NodeBehaviorSubject } from '../node-behavior-subject';
import { Action } from '../types-and-interfaces/action';
import { Middleware } from '../types-and-interfaces/middleware';
import { NodeConstructor } from '../types-and-interfaces/node-constructor';
import { TriggerMiddleWare } from '../types-and-interfaces/trigger-middleware';
import { Update } from '../types-and-interfaces/update';

export function middlewareMixin<
    T,
    NBase extends NodeConstructor<NodeBehaviorSubject<T>>
>(
    middleware: Middleware[],
    triggerMiddleware: TriggerMiddleWare[],
    node: NBase
): NBase {
    return class extends node {
        constructor(...rest: any[]) {
            super(...rest);
            if (middleware.length > 0) {
                this.mapAction = chainMiddleware(
                    this as any,
                    this.mapAction,
                    middleware
                );
            }
            if (triggerMiddleware.length > 0) {
                this.mapTriggeredAction = (update: Update<T>) => {
                    let model: T = update.model
                    const tempWrapped = (action: Action) => {
                        model = this.mapTriggeredAction(update)
                        return action;
                    }
                    const tempChained = chainMiddleware(
                        this as any,
                        tempWrapped,
                        triggerMiddleware
                    );
                    if (update.action) {
                        tempChained(update.action);
                    }
                    return model;
                }
            }

        }
    }
}