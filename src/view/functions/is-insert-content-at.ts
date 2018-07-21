import { ModelToString } from '../types-and-interfaces/model-to-string';
import { Slot } from '../types-and-interfaces/slot';
import { TemplateElement } from '..';

export function isInsertContentAt(item: TemplateElement | ModelToString | Slot): item is Slot {
  return !!(item as any).placeholder;
}
