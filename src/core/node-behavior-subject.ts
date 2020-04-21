import { ConnectableObservable, Observable, PartialObserver, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map, pluck, publishBehavior, takeUntil, takeWhile } from 'rxjs/operators';
import { give } from './functions/node/give';
import { mapAction } from './functions/node/map-action';
import { triggerActions } from './functions/node/trigger-actions';
import { partial } from './functions/partial';
import { get } from './index';
import { NodeFactory } from './node.factory';
import { Action } from './types-and-interfaces/action';
import { ActionMap } from './types-and-interfaces/action-map';
import { ActionMaps } from './types-and-interfaces/action-maps';
import { Node } from './types-and-interfaces/node';
import { Translator } from './types-and-interfaces/translator';
import { Update } from './types-and-interfaces/update';

export class NodeBehaviorSubject<T> extends Observable<Readonly<T>> implements Node<T> {
  protected model: T | null = null;
  protected mapAction: (action: Action) => Action;
  protected mapTriggeredAction: (model: T, action: Action) => T;
  protected triggerActions: (model: T, actions: Action[]) => Action[];
  protected _updates: Subject<Update<T>> = new Subject<Update<T>>();
  protected disposed: boolean = false;
  protected wasDisposed: Subject<boolean> = new Subject<boolean>();
  protected subscriptionCount: number = 0;
  protected factory!: NodeFactory;
  protected stream!: Observable<T>;

  constructor(m: T,
              actionMaps: ActionMaps<T>,
              factory: NodeFactory,
              stream?: Observable<T | null>) {
    super();
    const actionMap: (model: T, action: Action) => T = partial(mapAction, actionMaps);
    this.mapAction = (action: Action) => {
      const model = actionMap(this.model as T, action);
      this._updates.next({ actions: [action], model });
      return action;
    };
    this.mapTriggeredAction = (model: T, action: Action) => {
      return actionMap(model, action);
    };
    this.triggerActions = partial(triggerActions, actionMaps);
    this.factory = factory;
    this.stream = this.createDisposingStream(stream || this.createRootStream(m));
    this.connectModelUpdates();
  }

  public get value(): T | null {
    return this.model;
  }

  public get updates(): Observable<Update<T>> {
    return this._updates;
  }

  public next(action: Action): Action {
    return this.executeAction(action);
  }

  public createChild<U>(actionMapOrActionMaps: ActionMaps<U> | ActionMap<U>,
                        translatorOrProperty: Translator<T, U> | string,
                        ...properties: string[]) {
    let child: NodeBehaviorSubject<U>;
    let model: U | null;
    let stream: Observable<U | null>;
    let giveFunc: (m: T, mm: U) => T;
    if (typeof translatorOrProperty !== 'string') {
      const translator: Translator<T, U> = translatorOrProperty;
      model = translator.get(this.model as T);
      stream = this.pipe(map((value: T) => {
        return translator.get(value);
      })) as Observable<U>;
      giveFunc = (parentModel: T, childModel: U) => {
        return translator.give(parentModel, childModel);
      };
    } else {
      const props: string[] = [translatorOrProperty].concat(properties);
      model = get<T, U>(this.model as T, ...props);
      stream = this.pipe(pluck(...props));
      giveFunc = (parentModel: T, childModel: U) => {
        return give(parentModel, childModel, ...props);
      };
    }
    const childStream = stream.pipe(
      map((value: U | null) => {
        if (value === undefined) {
          return null;
        }
        return value;
      }));
    child = this.factory.createNode(model, actionMapOrActionMaps, childStream);
    child.updates.subscribe((value: Update<U>) => {
      const translatedModel: T = giveFunc(this.model as T, value.model);
      this.childUpdated(translatedModel, value.actions);
    });
    return child;
  }

  public subscribe(): Subscription;
  public subscribe(observer: PartialObserver<T>): Subscription;
  public subscribe(next?: ((value: T) => void),
                   error?: (error: any) => void,
                   complete?: () => void): Subscription;
  public subscribe(...args: any): Subscription {
    const stream: Observable<T> = this.stream;
    let subscription: Subscription = stream.subscribe(...args);
    const unsubscribe = {
      unsubscribe: () => {
        this.unsubscribed();
      }
    };
    subscription.add(unsubscribe);
    this.subscriptionCount++;
    return subscription;
  }

  protected createRootStream(initialValue: T | null): Observable<T> {
    const stream: ConnectableObservable<T> = this._updates.pipe(
      map((update: Update<T>) => {
        return update.model;
      }),
      publishBehavior(initialValue)
    ) as ConnectableObservable<T>;
    stream.connect();
    return stream;
  }

  protected createDisposingStream(stream: Observable<T | null>): Observable<T> {
    return stream.pipe(
      distinctUntilChanged() as any,
      takeWhile((model: T) => {
        return model !== null;
      }),
      takeUntil(this.wasDisposed));
  }

  protected connectModelUpdates(): void {
    this.stream.subscribe((model: T) => {
      this.model = model;
    }, () => {
      // .
    }, () => {
      this._updates.complete();
    });
  }

  protected executeAction(action: Action): Action {
    return this.mapAction(action);
  }

  protected childUpdated(model: T, actions: Action[]) {
    const triggeredActions: Action[] = this.triggerActions(model, actions);
    model = triggeredActions.reduce(this.mapTriggeredAction, model);
    this._updates.next({ actions: actions.concat(triggeredActions), model });
  }

  protected unsubscribed(): void {
    this.subscriptionCount--;
    if (this.subscriptionCount <= 0) {
      this.dispose();
    }
  }

  protected dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.wasDisposed.next(true);
    }
  }

}
