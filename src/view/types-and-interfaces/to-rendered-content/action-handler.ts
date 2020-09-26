import { Action } from '../../../core';

export type ActionHandler = (name: string, detail: object, action: Action) => void;
