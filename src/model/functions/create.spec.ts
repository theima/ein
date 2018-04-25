import { create } from './create';
import { NodeSubject } from '../node-subject';
import { MockExecutorBuilder } from '../types-and-interfaces/executor.mock';

describe('create', () => {
  it('should create a node', () => {
    const model: any = {};
    const executorBuilder: MockExecutorBuilder = new MockExecutorBuilder();
    expect(create(executorBuilder.createHandlers(), model) instanceof NodeSubject).toBeTruthy();
  });
  it('should create a node with null', () => {
    const executorBuilder: MockExecutorBuilder = new MockExecutorBuilder();
    expect(create(executorBuilder.createHandlers(), null) instanceof NodeSubject).toBeTruthy();
  });
  it('should throw if we don\'t have an executor', () => {
    const model: any = {};
    expect(() => {
      create(null, model);
    }).toThrow();
  });
});
