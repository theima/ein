import { Reducer } from '../../../core';
import { ActionViewTemplate } from './action-view-template';

export interface NodeViewTemplate extends ActionViewTemplate {
  reducer: Reducer<any>;
}
