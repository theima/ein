import { Observable, ConnectableObservable, PartialObserver, Subscription, Subject } from 'rxjs';
import { pluck, distinctUntilChanged, takeWhile, takeUntil, map, publishBehavior, publishReplay } from 'rxjs/operators';
import { Action } from './types-and-interfaces/action';
import { Translator } from './types-and-interfaces/translator';
import { NodeFactory } from './node.factory';
import { get } from './index';
import { give } from './functions/give';
import { Node } from './types-and-interfaces/node';
import { Update } from './types-and-interfaces/update';
import { mapAction } from './functions/map-action';
import { mapTriggerAction } from './functions/map-trigger-action';
import { ActionMaps } from './types-and-interfaces/action-maps';
import { ActionMap } from './types-and-interfaces/action-map';
import { partial } from './functions/partial';

export class NodeBehaviorSubject<T> extends Observable<Readonly<T>> implements Node<T> {
  protected model: T | null;
  protected actionMap: (action: Action) => Action;
  protected triggeredActionMap: (model: T, action: Action) => T;
  protected triggerMap: (model: T, actions: Action[]) => Action[];
  protected _updates: Subject<Update<T>>;
  protected _stream!: Observable<T>;
  protected disposed: boolean = false;
  protected wasDisposed: Subject<boolean>;
  protected factory: NodeFactory;
  protected subscriptionCount: number;

  constructor(m: T | null,
              actionMaps: ActionMaps<T>,
              factory: NodeFactory,
              stream?: Observable<T | null>) {
    super();
    this.subscriptionCount = 0;
    this.model = null;
    const actionMapper: (model: T | null, action: Action) => T = partial(mapAction as any, actionMaps);
    this.actionMap = (action: Action) => {
      this.model = actionMapper(this.model, action);
      this._updates.next({ actions: [action], model: this.model });
      return action;
    };
    this.triggeredActionMap = (model: T, action: Action) => {
      return actionMapper(model, action);
    };
    this.triggerMap = partial(mapTriggerAction as any, actionMaps);
    this.factory = factory;
    this._updates = new Subject<Update<T>>();
    this.wasDisposed = new Subject<boolean>();
    this.stream = stream ? stream : this.createRootStream(m);
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
  public subscribe(nextOrObserver?: ((value: T) => void) | PartialObserver<T>,
                   error?: (error: any) => void,
                   complete?: () => void): Subscription {
    const stream: Observable<T> = this._stream;
    let subscription: Subscription;
    if (!nextOrObserver) {
      subscription = stream.subscribe();
    } else if (typeof nextOrObserver === 'function') {
      subscription = stream.subscribe(nextOrObserver, error, complete);
    } else {
      subscription = stream.subscribe(nextOrObserver);
    }
    const unsubscribe = {
      unsubscribe: () => {
        this.unsubscribed();
      }
    };
    subscription.add(unsubscribe);
    this.subscriptionCount++;
    return subscription;
  }

  protected set stream(value: Observable<T | null>) {
    this._stream = value.pipe(distinctUntilChanged() as any,
      takeWhile((model: T) => {
        return model !== null && model !== undefined;
      }),
      takeUntil(this.wasDisposed));
    this._stream.subscribe((model: T) => {
      this.model = model;
    }, () => {
      // .
    }, () => {
      this._updates.complete();
    });
  }

  protected dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.wasDisposed.next(true);
      this._updates.complete();
    }
  }

  protected unsubscribed(): void {
    this.subscriptionCount--;
    if (this.subscriptionCount <= 0) {
      this.dispose();
    }
  }

  protected createRootStream(initialValue: T | null): Observable<T> {
    let mapped: Observable<T> = this._updates.pipe(map((update: Update<T>) => {
      return update.model;
    }));
    const model: ConnectableObservable<T> = mapped.pipe(initialValue ? publishBehavior(initialValue) : publishReplay(1)) as ConnectableObservable<T>;
    model.connect();
    return model;
  }

  protected executeAction(action: Action): Action {
    return this.actionMap(action);
  }

  protected childUpdated(model: T, actions: Action[]) {
    const triggeredActions: Action[] = this.triggerMap(model, actions);
    model = triggeredActions.reduce(this.triggeredActionMap, model);
    this._updates.next({ actions: actions.concat(triggeredActions), model });
  }
}
