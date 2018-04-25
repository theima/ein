
import { HandlersWithAsync } from './handlers-with-async';
import { Action } from '../model';
export class MockExecutorBuilder {
  public lastModelForExecutor: any;
  public lastModelForTrigger: any;
  public returnValues: any[];
  public returnValue: any;
  public returnAction: Action | null;
  public actionsForTriggerAsync: any[] = [];
  public returnAsyncs: any = [];

  public createHandlers(): HandlersWithAsync<any> {
    return this.create(this) as any;
  }

  protected create(owner: MockExecutorBuilder) {
    return {
      executor: (model: any, action: Action) => {
        owner.lastModelForExecutor = model;
        if (owner.returnValues) {
          return owner.returnValues.shift();
        } else if (owner.returnValue) {
          return owner.returnValue;
        }
        return model;
      },
      trigger: (model: any, action: Action) => {
        owner.lastModelForTrigger = model;
        let a: Action = null;
        if (owner.returnAction) {
          a = owner.returnAction;
          owner.returnAction = null;
        }
        return a;
      },
      triggerAsync: (model: any, action: Action) => {
        owner.actionsForTriggerAsync.push(action);
        let a: Action = null;
        if (owner.returnAsyncs.length > 0) {
          a = owner.returnAsyncs.shift();
        }
        return a;
      }
    };
  }
}
