import { Value } from '../../core';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from './elements/model-to-element-or-null';
import { ModelToElements } from './elements/model-to-elements';
import { FilledSlot } from './slots/filled.slot';
import { MappedSlot } from './slots/mapped.slot';
import { FilledElementTemplate } from './templates/filled.element-template';

export type Modifier = (viewId: string, contentMap: (e: FilledElementTemplate | ModelToString | FilledSlot) => ModelToElementOrNull | ModelToElements | ModelToString | MappedSlot) =>
  (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElementOrNull | ModelToElements) =>
  (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElementOrNull | ModelToElements;
