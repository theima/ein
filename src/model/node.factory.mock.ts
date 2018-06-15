import { MockNodeSubject } from './node-subject.mock';
import { ActionMaps } from './types-and-interfaces/action-maps';
export class MockNodeFactory {
  public lastCreated: MockNodeSubject;

  public createNode<T, U>(initial: U,
                          actionMaps: ActionMaps<U>) {
    this.lastCreated = new MockNodeSubject(initial, actionMaps);
    return this.lastCreated;
  }
}
