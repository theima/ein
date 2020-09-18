import { Action } from '../../core';
import { ViewAction } from './view-action';

export type ActionMap = (model: any, viewAction: ViewAction) => Action | undefined;
