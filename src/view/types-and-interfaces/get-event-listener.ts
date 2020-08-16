import { Action } from '../../core';

export type GetEventListener = (name: string) => (action: Action) => void;
