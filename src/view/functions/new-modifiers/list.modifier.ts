import { Value } from '../../../core';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { createModelUpdateIfNeeded } from '../element-to-dynamic-node/create-model-update-if-needed';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';
import { createAnchorElement } from './functions/create-anchor-element';

export function listModifier(next: ElementTemplateToDynamicNode) {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const listProperty = getProperty(BuiltIn.List, elementTemplate);

    if (listProperty && typeof listProperty.value === 'string') {
      const anchor = createAnchorElement();
      let existing: DynamicNode[] = [];
      const childTemplate = removeProperty(BuiltIn.List, elementTemplate);
      const createNewChild = (preceding: ChildNode) => {
        const child = next(scope, childTemplate);
        preceding.after(child.node);
        return child;
      };
      const createUpdate = (models: Value[]) => {
        const newContent: DynamicNode[] = [];
        let precedingNode = anchor;
        models.forEach((value) => {
          const child = existing.shift() || createNewChild(precedingNode);
          newContent.push(child);
          precedingNode = child.node;

        });
        existing.forEach((c) => {
          const existingElement = c.node as HTMLElement;
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

      return { node: anchor, contentUpdate};
    }
    return next(scope, elementTemplate);
  };
}
