import { execute } from './execute';
import { MockExecutorBuilder } from '../types-and-interfaces/executor.mock';
import { Handlers } from '../types-and-interfaces/handlers';

describe('execute', () => {
  let executorBuilder: MockExecutorBuilder;
  let handlers: Handlers<any>;
  beforeEach(() => {
    executorBuilder = new MockExecutorBuilder();
    handlers = executorBuilder.createHandlers();
  });
  it('should call executor with false', () => {
    spyOn(handlers, 'executor').and.callThrough();
    execute(handlers, false, {type: 's'});
    expect(executorBuilder.lastModelForExecutor === false).toBeTruthy();
  });
  it('should call executor with 0', () => {
    spyOn(handlers, 'executor').and.callThrough();
    execute(handlers, 0, {type: 's'});
    expect(executorBuilder.lastModelForExecutor === 0).toBeTruthy();
  });
});
