import { Action } from '../../../core';

export type ActionHandler = (name: string, action: Action) => void;
