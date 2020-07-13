import { Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { ModelToElement } from './elements/model-to-element';
import { ModelToElements } from './elements/model-to-elements';
import { ElementTemplate } from './templates/element-template';

export type Modifier = (viewId: string) =>
  (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElement | ModelToElements) =>
  (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElement | ModelToElements;
