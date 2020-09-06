import { Action, partial, Value } from '../../../core';
import { ActionHandler } from '../../types-and-interfaces/action-handler';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { DynamicNode } from '../../types-and-interfaces/new-elements/dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/templates/element-template-content';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { contentToUpdate } from '../element-to-dynamic-node/content-to-update';
import { newApplyViewTemplate } from '../new-elements/new-apply-view-template';
import { createActionHandler } from './action-handling/create-action-handler';
import { toEvent } from './view-builder/to-event';

export function viewElementBuilder(getViewTemplate: (name: string) => ViewTemplate | undefined,
                                   toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicNode[]) {
  return (next: ElementTemplateToDynamicNode): ElementTemplateToDynamicNode => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const viewTemplate = getViewTemplate(elementTemplate.name);
      if (viewTemplate) {
        let actionHandler: ActionHandler;
        const handleAction = (name: string, action: Action) => {
          actionHandler?.(name, action);
        };
        const viewElementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
        const getEventListener = (name: string) => partial(handleAction, name);
        const content = elementTemplate.content;
        let slotContentUpdate: ModelUpdate | undefined;
        const getContent = () => {
          const dynamicContent = toContent(scope, content);
          slotContentUpdate = contentToUpdate(dynamicContent);
          return dynamicContent.map((d) => d.node);
        };
        let childScope: ViewScope = { ...scope, getEventListener, getContent };
        const result = next(childScope, viewElementTemplate);
        if (viewTemplate.actionMap) {
          const handler = (a: Action) => {
            const event = toEvent(a);
            result.node.dispatchEvent(event);
          };
          actionHandler = createActionHandler(scope.node, handler, viewTemplate.actionMap);
        }
        const elementContentUpdate = result.contentUpdate;
        const contentUpdate: ModelUpdate = (m: Value) => {
          elementContentUpdate?.(m);
          slotContentUpdate?.(m);
        };
        return {...result, contentUpdate};
      }
      return next(scope, elementTemplate);

    };

  };

}
