import { Action } from '../../../core';

export type GetActionListener = (name: string) => (action: Action) => void;
