import { Action } from './action';
import { Handlers } from './handlers';
export class MockExecutorBuilder {
  public lastModelForExecutor: any;
  public lastModelForTrigger: any;
  public returnValues: any[];
  public returnValue: any;
  public returnAction: Action;

  public createHandlers(): Handlers<any> {
    return this.create(this);
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
      }
    };
  }
}
