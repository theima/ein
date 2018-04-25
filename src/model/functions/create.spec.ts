import { create } from './create';
import { EmceSubject } from '../emce-subject';
import { MockExecutorBuilder } from '../types-and-interfaces/executor.mock';

describe('create', () => {
  it('should create an emce', () => {
    const model: any = {};
    const executorBuilder: MockExecutorBuilder = new MockExecutorBuilder();
    expect(create(executorBuilder.createHandlers(), model) instanceof EmceSubject).toBeTruthy();
  });
  it('should create an emce with null', () => {
    const executorBuilder: MockExecutorBuilder = new MockExecutorBuilder();
    expect(create(executorBuilder.createHandlers(), null) instanceof EmceSubject).toBeTruthy();
  });
  it('should throw if we don\'t have an executor', () => {
    const model: any = {};
    expect(() => {
      create(null, model);
    }).toThrow();
  });
});
