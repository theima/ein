import { MockNodeSubject } from './node-subject.mock';
import { Handlers } from './types-and-interfaces/handlers';
export class MockNodeFactory {
  public lastCreated: MockNodeSubject;

  public createNode<T, U>(initial: U,
                          handlers: Handlers<U>) {
    this.lastCreated = new MockNodeSubject(initial, handlers);
    return this.lastCreated;
  }
}
