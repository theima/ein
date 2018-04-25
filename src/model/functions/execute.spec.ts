import { execute } from './execute';
import { Action } from '../types-and-interfaces/action';
import { MockExecutorBuilder } from '../types-and-interfaces/executor.mock';
import { Handlers } from '../types-and-interfaces/handlers';
describe('execute', () => {
  let executorBuilder: MockExecutorBuilder;
  let executor: Handlers<any>;
  let e: (model: any | null, action: Action) => any;
  beforeEach(() => {
    executorBuilder = new MockExecutorBuilder();
    executor = executorBuilder.createHandlers();
    e = execute(executor);
  });
  it('should call executor with false', () => {
    spyOn(executor, 'executor').and.callThrough();
    e(false, {type: 's'});
    expect(executorBuilder.lastModelForExecutor === false).toBeTruthy();
  });
  it('should call executor with 0', () => {
    spyOn(executor, 'executor').and.callThrough();
    e(0, {type: 's'});
    expect(executorBuilder.lastModelForExecutor === 0).toBeTruthy();
  });
});
