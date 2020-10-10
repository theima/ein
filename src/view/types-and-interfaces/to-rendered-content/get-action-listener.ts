import { Action } from '../../../core';

export type GetActionListener = (name: string, detail?: Record<string, unknown>) => (action: Action) => void;
