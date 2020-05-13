import { Action } from '../types-and-interfaces/action';
export class MockActionMapBuilder {
  public lastModelForActionMap: any;
  public lastModelForTrigger: any;
  public returnValues: any[] | null = null;
  public returnValue: any;
  public returnAction: Action| null = null;

  public createActionMaps() {

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
      trigger: (model: any, action: Action) => {
        owner.lastModelForTrigger = model;
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
