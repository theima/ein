import { ViewData } from './view-data';
import { Property } from './property';
import { Executor, Handlers } from 'emce';

export interface EmceViewData extends ViewData{
  createChildFrom: (properties: Property[]) => string[];
  executorOrHandlers: Executor<any> | Handlers<any>;
}
