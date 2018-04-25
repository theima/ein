import { MockEmceSubject } from './emce-subject.mock';
import { Handlers } from './types-and-interfaces/handlers';
export class MockEmceFactory {
  public lastCreated: MockEmceSubject;

  public createEmce<T, U>(initial: U,
                          handlers: Handlers<U>) {
    this.lastCreated = new MockEmceSubject(initial, handlers);
    return this.lastCreated;
  }
}
