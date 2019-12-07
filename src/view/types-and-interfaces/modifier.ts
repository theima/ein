import { Value } from '../../core';
import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from './elements/model-to-element-or-null';
import { ModelToElements } from './elements/model-to-elements';
import { FilledElementTemplate } from './templates/filled.element-template';

export type Modifier = (viewId: string) =>
  (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElementOrNull | ModelToElements) =>
  (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElementOrNull | ModelToElements;
