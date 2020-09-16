import { Action, create, partial, Value } from '../../../core';
import { ComponentTemplate } from '../../types-and-interfaces/component/component';
import { ComponentAction } from '../../types-and-interfaces/component/component-action';
import { ComponentCallbacks } from '../../types-and-interfaces/component/component-callbacks';
import { PropertyUpdateAction } from '../../types-and-interfaces/component/property-update.action';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { mapPropertiesToDict } from '../modifiers/extender/map-properties-to-dict';
import { addOnDestroy } from '../template-to-rendered-content/add-on-destroy';
import { createActionHandler } from './action-handling/create-action-handler';
import { toGetActionListener } from './action-handling/to-get-action-listener';
import { applyViewTemplate } from './apply-view-template';
import { connectToNode } from './node-view-builder/connect-to-node';

export function componentElementBuilder(getComponent: (name: string) => ComponentTemplate | undefined,
                                        toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicContent[]) {
  return (next: TemplateToElement): TemplateToElement => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const componentTemplate = getComponent(elementTemplate.name);
      if (componentTemplate) {
        const tempNode = create({}, componentTemplate.reducer);
        const getEventListener = toGetActionListener(createActionHandler(tempNode, (action: Action) => tempNode.next(action), componentTemplate.actionMap));
        const componentScope: ViewScope = {
          node: tempNode,
          handleContent: () => [],
          getActionListener: getEventListener
        };
        let initiated: ComponentCallbacks;
        const afterAdd = (element: HTMLElement) => {
          initiated = componentTemplate.initiate(element, tempNode);
        };
        const componentElementTemplate = applyViewTemplate(elementTemplate, componentTemplate);
        const result = next(componentScope, componentElementTemplate);

        const toProperties = partial(mapPropertiesToDict, elementTemplate.properties);
        const oldPropertyUpdate = result.propertyUpdate;
        const unsubscribe = connectToNode(tempNode, result);
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

  };

}
