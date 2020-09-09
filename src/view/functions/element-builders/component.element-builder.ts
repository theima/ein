import { Action, NodeBehaviorSubject, partial, Value } from '../../../core';
import { ComponentTemplate } from '../../types-and-interfaces/component/component';
import { ComponentAction } from '../../types-and-interfaces/component/component-action';
import { ComponentCallbacks } from '../../types-and-interfaces/component/component-callbacks';
import { PropertyUpdateAction } from '../../types-and-interfaces/component/property-update.action';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { newApplyViewTemplate } from '../new-elements/new-apply-view-template';
import { mapPropertiesToDict } from '../new-modifiers/extender/map-properties-to-dict';
import { createActionHandler } from './action-handling/create-action-handler';
import { toGetEventListener } from './action-handling/to-get-event-listener';
import { connectToNode } from './node-view-builder/connect-to-node';

export function componentElementBuilder(getComponent: (name: string) => ComponentTemplate | undefined,
                                        toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicNode[]) {
  return (next: ElementTemplateToDynamicNode): ElementTemplateToDynamicNode => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const componentTemplate = getComponent(elementTemplate.name);
      if (componentTemplate) {
        const tempNode = new NodeBehaviorSubject({},componentTemplate.reducer, null as any);
        const getEventListener = toGetEventListener(createActionHandler(tempNode as any, (action: Action) => tempNode.next(action), componentTemplate.actionMap));
        const componentScope: ViewScope = {
          node: tempNode as any,
          getContent: () => [],
          getEventListener
        };
        let initiated: ComponentCallbacks;
        const afterAdd = (element: HTMLElement) => {
          initiated = componentTemplate.initiate(element, tempNode);
        };
        const componentElementTemplate = newApplyViewTemplate(elementTemplate, componentTemplate);
        const result = next(componentScope, componentElementTemplate);
        const oldOnDestroy = result.onDestroy;
        const onDestroy = () => {
          oldOnDestroy?.();
          initiated.onBeforeDestroy?.();
        };
        const toProperties = partial(mapPropertiesToDict, elementTemplate.properties);
        const oldPropertyUpdate = result.propertyUpdate;
        connectToNode(tempNode as any, result);
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
