import { Action } from '../../../core';

export type ActionHandler = (name: string, detail: Record<string, unknown>, action: Action) => void;
