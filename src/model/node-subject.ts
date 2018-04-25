import { Observable } from 'rxjs/Observable';
import { PartialObserver } from 'rxjs/Observer';
import { Action } from './types-and-interfaces/action';
import { Translator } from './types-and-interfaces/translator';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/takeUntil';
import { Subscription } from 'rxjs/Subscription';
import { NodeFactory } from './node.factory';
import { get } from './functions/get';
import { give } from './functions/give';
import { Node } from './types-and-interfaces/node';
import { Update } from './types-and-interfaces/update';
import { Subject } from 'rxjs/Subject';
import { ConnectableObservable } from 'rxjs/Observable/ConnectableObservable';
import { execute } from './functions/execute';
import { trigger } from './functions/trigger';
import { Handlers } from './types-and-interfaces/handlers';
import { Executor } from './types-and-interfaces/executor';

export class NodeSubject<T> extends Observable<Readonly<T>> implements Node<T> {
  protected model: T | null;
  protected execute: (action: Action) => Action;
  protected executeForTriggered: (model: T, action: Action) => T;
  protected triggerAction: (model: T, actions: Action[]) => Action[];
  protected _updates: Subject<Update<T>>;
  protected _stream!: Observable<T>;
  protected disposed: boolean = false;
  protected streamSubscription: Subscription | null = null;
  protected wasDisposed: Subject<boolean>;
  protected factory: NodeFactory;

  constructor(m: T | null,
              handlers: Handlers<T>,
              factory: NodeFactory) {
    super();
    this.model = null;
    const executor: (model: T | null, action: Action) => T = execute(handlers);
    this.execute = (action: Action) => {
      this.model = executor(this.model, action);
      this._updates.next({actions: [action], model: this.model});
      return action;
    };
    this.executeForTriggered = (model: T, action: Action) => {
      return executor(model, action);
    };
    this.triggerAction = trigger(handlers);
    this.factory = factory;
    this._updates = new Subject<Update<T>>();
    this.wasDisposed = new Subject<boolean>();
    let mapped: Observable<T> = this._updates.map((update: Update<T>) => {
      return update.model;
    });
    const model: ConnectableObservable<T> = m ? mapped.publishBehavior(m) : mapped.publishReplay(1);
    model.connect();
    this.stream = model;
  }

  public get value(): T | null {
    return this.model;
  }

  public get updates(): Observable<Update<T>> {
    return this._updates;
  }

  public set stream(value: Observable<T>) {
    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }
    this._stream = value.distinctUntilChanged()
      .takeWhile((model: T) => {
        return !!model;
      })
      .takeUntil(this.wasDisposed);
    this.streamSubscription = this._stream.subscribe((model: T) => {
      this.model = model;
    }, () => {
      // .
    }, () => {
      this._updates.complete();
    });
  }

  public next(action: Action): Action {
    return this.executeAction(action);
  }

  public createChild<U>(executorOrHandlers: Handlers<U> | Executor<U>,
                        translatorOrProperty: Translator<T, U> | string,
                        ...properties: string[]) {
    let child: NodeSubject<U>;
    let model: U | null;
    let stream: Observable<U>;
    let giveFunc: (m: T, mm: U) => T;
    if (typeof translatorOrProperty !== 'string') {
      const translator: Translator<T, U> = translatorOrProperty;
      model = translator.get(this.model as T);
      stream = this.map((value: T) => {
        return translator.get(value);
      }) as Observable<U>;
      giveFunc = (parentModel: T, childModel: U) => {
        return translator.give(parentModel, childModel);
      };
    } else {
      const props: string[] = [translatorOrProperty].concat(properties);
      model = get<T, U>(this.model as T, ...props);
      stream = this.pluck(...props);
      giveFunc = (parentModel: T, childModel: U) => {
        return give(parentModel, childModel, ...props);
      };
    }
    child = this.factory.createNode(model, executorOrHandlers);
    child.stream = stream.map((value: U) => {
      if (!value) {
        return null;
      }
      return value;
    }) as Observable<U>;
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
    let next: ((value: T) => void);
    let observer: PartialObserver<T>;
    const stream: Observable<T> = this._stream;
    if (!nextOrObserver) {
      return stream.subscribe();
    }
    if (typeof nextOrObserver === 'function') {
      next = nextOrObserver;
      return stream.subscribe(next, error, complete);
    } else {
      observer = nextOrObserver;
    }
    return stream.subscribe(observer);
  }

  public dispose() {
    if (!this.disposed) {
      this.disposed = true;
      this.wasDisposed.next(true);
      this._updates.complete();
    }
  }

  protected executeAction(action: Action): Action {
    return this.execute(action);
  }

  protected childUpdated(model: T, actions: Action[]) {
    const triggeredActions: Action[] = this.triggerAction(model, actions);
    model = triggeredActions.reduce(this.executeForTriggered, model);
    this._updates.next({actions: actions.concat(triggeredActions), model});
  }
}
