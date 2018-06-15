import { Action } from './action';
import { ActionMaps } from './action-maps';
export class MockActionMapBuilder {
  public lastModelForActionMap: any;
  public lastModelForTriggerMap: any;
  public returnValues: any[] | null = null;
  public returnValue: any;
  public returnAction: Action| null = null;

  public createActionMaps(): ActionMaps<any> {

    return this.create(this);
  }

  protected create(owner: MockActionMapBuilder) {
    return {
      actionMap: (model: any, action: Action) => {
        owner.lastModelForActionMap = model;
        if (owner.returnValues) {
          return owner.returnValues.shift();
        } else if (owner.returnValue) {
          return owner.returnValue;
        }
        return model;
      },
      triggerMap: (model: any, action: Action) => {
        owner.lastModelForTriggerMap = model;
        let a: Action | null = null;
        if (owner.returnAction) {
          a = owner.returnAction;
          owner.returnAction = null;
        }
        return a;
      }
    };
  }
}
