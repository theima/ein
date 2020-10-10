import { Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { ModifierProperty } from '../../types-and-interfaces/modifier-property';
import { DynamicElement } from '../../types-and-interfaces/to-rendered-content/dynamic-element';
import { TemplateToContent } from '../../types-and-interfaces/to-rendered-content/template-to-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
import { createModelUpdateIfNeeded } from '../template-to-rendered-content/create-model-update-if-needed';
import { createAnchorElement } from './functions/create-anchor-element';

export function listElementModifier(
  create: TemplateToElement
): (next: TemplateToContent) => TemplateToContent {
  return (next: TemplateToContent) => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const listProperty = getProperty(ModifierProperty.List, elementTemplate);
      if (listProperty && typeof listProperty.value === 'string') {
        const anchor = createAnchorElement();
        const childTemplate = removeProperty(
          ModifierProperty.List,
          elementTemplate
        );
        const createNewChild = (preceding: ChildNode, index: number) => {
          const childScope = { ...scope, detail: { index } };
          const child = create(childScope, childTemplate);
          preceding.after(child.element);
          return child;
        };
        let existing: DynamicElement[] = [];
        const updateWithList = (models: Value[]) => {
          const newContent: DynamicElement[] = [];
          let precedingNode: ChildNode = anchor;
          models.forEach((value, index) => {
            const child =
              existing.shift() || createNewChild(precedingNode, index);
            newContent.push(child);
            precedingNode = child.element;
          });
          existing.forEach((c) => {
            const existingElement = c.element;
            existingElement.remove();
            c.onDestroy?.();
          });
          existing = newContent;
          const updates: Array<ModelUpdate | undefined> = existing.map(
            (element) => {
              return createModelUpdateIfNeeded(element);
            }
          );
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
          const update = updateWithList(list);
          update?.(list);
        };
        const onDestroy = () => {
          existing.forEach((c) => {
            c.onDestroy?.();
          });
        };
        return { isAnchor: true, element: anchor, contentUpdate, onDestroy };
      }
      return next(scope, elementTemplate);
    };
  };
}
