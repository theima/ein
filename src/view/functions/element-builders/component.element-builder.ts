import { create, Node, partial, Value } from '../../../core';
import { ComponentTemplate } from '../../types-and-interfaces/component/component';
import { ComponentAction } from '../../types-and-interfaces/component/component-action';
import { ComponentCallbacks } from '../../types-and-interfaces/component/component-callbacks';
import { PropertyUpdateAction } from '../../types-and-interfaces/component/property-update.action';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { TemplateContentToRenderedContentList } from '../../types-and-interfaces/to-rendered-content/template-content-to-rendered-content-list';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { mapPropertiesToDict } from '../modifiers/extender/map-properties-to-dict';
import { addOnDestroy } from '../template-to-rendered-content/add-on-destroy';
import { applyViewTemplate } from './apply-view-template';
import { connectToNode } from './node-view-builder/connect-to-node';
import { createNodeActionListener } from './node-view-builder/create-node-action-listener';

export function componentElementBuilder(getComponent: (name: string) => ComponentTemplate | undefined,
                                        toContent: TemplateContentToRenderedContentList): (next: TemplateToElement) => TemplateToElement {
  return (next: TemplateToElement) => {
    const ba:TemplateToElement =  (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const componentTemplate = getComponent(elementTemplate.name);
      if (componentTemplate) {
        const tempNode: Node<unknown> = create({}, componentTemplate.reducer);
        const componentScope: ViewScope = {
          node: tempNode as Node<Value>,
          handleContent: () => [],
          getActionListener: createNodeActionListener(tempNode as Node<Value>, componentTemplate.actionMap)
        };
        let initiated: ComponentCallbacks;
        const afterAdd = (element: HTMLElement) => {
          initiated = componentTemplate.initiate(element, tempNode);
        };
        const componentElementTemplate = applyViewTemplate(elementTemplate, componentTemplate);
        const result = next(componentScope, componentElementTemplate);

        const toProperties = partial(mapPropertiesToDict, elementTemplate.properties);
        const oldPropertyUpdate = result.propertyUpdate;
        const unsubscribe = connectToNode(tempNode as Node<Value>, result);
        const onDestroy = () => {
          initiated.onBeforeDestroy?.();
          unsubscribe?.unsubscribe();
        };
        const propertyUpdate = (m: Value) => {
          oldPropertyUpdate?.(m);
          const properties = toProperties(m);
          const action: PropertyUpdateAction = {
            type: ComponentAction.PropertyUpdate,
            properties
          };
          tempNode.next(action);
        };
        return addOnDestroy({ ...result, afterAdd, onDestroy, propertyUpdate }, onDestroy);
      }
      return next(scope, elementTemplate);

    };
    return ba;
  };

}
