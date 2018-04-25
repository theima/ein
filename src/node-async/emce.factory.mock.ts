import { MockEmceSubject } from './emce-subject.mock';
import { Executor } from '../model';

export class MockEmceFactory {
  public lastCreated: MockEmceSubject;

  public createEmce<T, U>(initial: U,
                          executor: Executor<U>) {
    this.lastCreated = new MockEmceSubject(initial, executor);
    return this.lastCreated;
  }
}
