import { ModelToString } from '../types-and-interfaces/model-to-string';
import { InsertContentAt } from '../types-and-interfaces/insert-content-at';
import { TemplateElement } from '../../html-template';

export function isInsertContentAt(item: TemplateElement | ModelToString | InsertContentAt): item is InsertContentAt {
  return !!(item as any).placeholder;
}
