import { Value } from '../../../core';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
import { createModelUpdateIfNeeded } from '../template-to-rendered-content/create-model-update-if-needed';
import { createAnchorElement } from './functions/create-anchor-element';

export function listModifier(getId: () => number) {
  return (next: TemplateToElement) => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const listProperty = getProperty(BuiltIn.List, elementTemplate);

      if (listProperty && typeof listProperty.value === 'string') {
        const anchor = createAnchorElement();
        let existing: DynamicElement[] = [];
        const childTemplate = removeProperty(BuiltIn.List, elementTemplate);
        const createNewChild = (preceding: ChildNode) => {
          const child = next(scope, childTemplate);
          preceding.after(child.element);
          return child;
        };
        const createUpdate = (models: Value[]) => {
          const newContent: DynamicElement[] = [];
          let precedingNode = anchor;
          models.forEach((value) => {
            const child = existing.shift() || createNewChild(precedingNode);
            newContent.push(child);
            precedingNode = child.element;

          });
          existing.forEach((c) => {
            const existingElement = c.element as HTMLElement;
            existingElement.remove();
          });
          existing = newContent;
          const updates: Array<ModelUpdate | undefined> = existing.map((node) => {
            return createModelUpdateIfNeeded(node);
          });
          return (m: Value[]) => {
            updates.forEach((update, index) => {
              const childModel = m[index];
              update?.(childModel);
            });
          };
        };
        const keystring: string = listProperty.value;
        const toList: (m: Value) => Value[] = (m: Value) => {
          const value = getModel(m, keystring);
          if (Array.isArray(value)) {
            return value;
          }
          return [];
        };
        const contentUpdate = (m: Value) => {
          const list = toList(m);
          const update = createUpdate(list);
          update?.(list);
        };

        return { id: getId(), element: anchor, contentUpdate };
      }
      return next(scope, elementTemplate);
    };
  };
}
