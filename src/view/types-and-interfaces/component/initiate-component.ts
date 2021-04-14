import { Node } from '../../../core';
import { ComponentCallbacks } from './component-callbacks';

export type InitiateComponent = (element: HTMLElement, node: Node<any>) => ComponentCallbacks;
