import { Action, create, partial, Value } from '../../../core';
import { ComponentTemplate } from '../../types-and-interfaces/component/component';
import { ComponentAction } from '../../types-and-interfaces/component/component-action';
import { ComponentCallbacks } from '../../types-and-interfaces/component/component-callbacks';
import { PropertyUpdateAction } from '../../types-and-interfaces/component/property-update.action';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { mapPropertiesToDict } from '../modifiers/extender/map-properties-to-dict';
import { createActionHandler } from './action-handling/create-action-handler';
import { toGetActionListener } from './action-handling/to-get-action-listener';
import { applyViewTemplate } from './apply-view-template';
import { connectToNode } from './node-view-builder/connect-to-node';

export function componentElementBuilder(getComponent: (name: string) => ComponentTemplate | undefined,
                                        toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicElement[]) {
  return (next: TemplateToElement): TemplateToElement => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const componentTemplate = getComponent(elementTemplate.name);
      if (componentTemplate) {
        const tempNode = create({}, componentTemplate.reducer);
        const getEventListener = toGetActionListener(createActionHandler(tempNode, (action: Action) => tempNode.next(action), componentTemplate.actionMap));
        const componentScope: ViewScope = {
          node: tempNode,
          getContent: () => [],
          getActionListener: getEventListener
        };
        let initiated: ComponentCallbacks;
        const afterAdd = (element: HTMLElement) => {
          initiated = componentTemplate.initiate(element, tempNode);
        };
        const componentElementTemplate = applyViewTemplate(elementTemplate, componentTemplate);
        const result = next(componentScope, componentElementTemplate);
        const oldOnDestroy = result.onDestroy;
        const onDestroy = () => {
          oldOnDestroy?.();
          initiated.onBeforeDestroy?.();
        };
        const toProperties = partial(mapPropertiesToDict, elementTemplate.properties);
        const oldPropertyUpdate = result.propertyUpdate;
        connectToNode(tempNode, result);
        const propertyUpdate = (m: Value) => {
        oldPropertyUpdate?.(m);
        const properties = toProperties(m);
        const action: PropertyUpdateAction = {
          type: ComponentAction.PropertyUpdate,
          properties
        };
        tempNode.next(action);
      };
        return {...result, afterAdd, onDestroy, propertyUpdate};
      }
      return next(scope, elementTemplate);

    };

  };

}
