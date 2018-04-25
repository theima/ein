import { Observable } from 'rxjs/Observable';
import { Update } from './types-and-interfaces/update';
import { Subject } from 'rxjs/Subject';

export class MockEmceSubject {
  public initialModel: any;
  public valueToReturn: any = {};
  public returnValueForExecuteTrigger: any = {v: 'default'};
  public lastNextCalledWith: any;
  public lastExecuteCalledWith: any;
  public lastTriggerCalledWith: any[];
  public lastModelRecieved: any;
  public disposed: boolean;
  public completed: boolean;
  public errored: boolean;
  private _updates: Subject<Update<any>>;

  constructor(model: any, handlers: any) {
    this.initialModel = model;
    this.valueToReturn = this.initialModel;
    this._updates = new Subject<Update<any>>();
  }

  public get value() {
    return this.valueToReturn;
  }

  public next(a: any) {
    this.lastNextCalledWith = a;
  }

  public executeAction(action: any): any {
    this.lastExecuteCalledWith = action;
  }

  public executeTrigger(model: any, action: any): any {
    this.lastTriggerCalledWith = [model, action];
    return this.returnValueForExecuteTrigger;
  }

  public sendUpdate(result: Update<any>) {
    this._updates.next(result);
  }

  public get updates(): Observable<Update<any>> {
    return this._updates;
  }

  public set stream(value: Observable<any>) {
    value.subscribe((model: any) => {
      this.lastModelRecieved = model;
    }, () => {
      this.errored = true;
    }, () => {
      this.completed = true;
    });
  }

  public dispose() {
    this.disposed = true;
  }
}
