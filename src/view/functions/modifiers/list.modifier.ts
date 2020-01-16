import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { getModel } from '../get-model';
import { getProperty } from '../get-property';
import { removeProperty } from '../template-element/remove-property';

export function listModifier(viewId: string) {
  return (next: (node: NodeAsync<Value>, template: ElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: ElementTemplate) => {
      const listProperty = getProperty(BuiltIn.List, template);
      if (listProperty && typeof listProperty.value === 'string') {
        let indexName='index';
        let replaceIndex = false;
        const nameProperty = getProperty(BuiltIn.ListIndex, template);
        if (nameProperty && typeof nameProperty.value === 'string') {
          replaceIndex = true;
          indexName = nameProperty.value;
        }
        let identifierName = 'id';
        const idProperty = getProperty(BuiltIn.ListId, template);
        if (idProperty && typeof idProperty.value === 'string') {
          identifierName = idProperty.value;
        }
        const keystring: string = listProperty.value;
        const modelMap = (m: Value) => {
          return getModel(m, keystring);
        };
        const repeatedElement = removeProperty(BuiltIn.List, template);
        const itemMap: ModelToElement = next(node, repeatedElement) as ModelToElement;
        const toList: ModelToElementOrNull | ModelToElements = (m: Value) => {
          const items = modelMap(m);
          if (Array.isArray(items)) {
            const list = items.map((m, index: number) => {
              if (typeof m ==='object' && (replaceIndex || m[indexName] === undefined)) {
                m[indexName] = index;
              }
              let e = itemMap(m);
              let childId = index;
              if (m[identifierName] !== undefined) {
               childId = m[identifierName];
              }
              e.id = viewId + '-' + childId;
              return e;
            });
            return list;
          }
          return null as any;
        };
        return toList;
      }
      return next(node, template);
    };
  };

}
