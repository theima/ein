import { Action } from '../../../core';

export type GetActionListener = (name: string, detail?: object) => (action: Action) => void;
