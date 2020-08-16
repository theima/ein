import { Action } from '../../core';
import { ViewAction } from '../../view';

export type ActionMap = (model: any, viewAction: ViewAction) => Action | undefined;
