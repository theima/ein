import { Action, partial } from '../../../core';
import { ActionHandler } from '../../types-and-interfaces/action-handler';
import { ElementTemplateToDynamicNode } from '../../types-and-interfaces/element-template-to-dynamic-node';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { ViewScope } from '../../types-and-interfaces/view-scope';
import { ViewTemplate } from '../../types-and-interfaces/view-templates/view-template';
import { newApplyViewTemplate } from '../new-elements/new-apply-view-template';
import { createActionHandler } from './action-handling/create-action-handler';
import { toEvent } from './view-builder/to-event';

export function viewElementBuilder(getViewTemplate: (name: string) => ViewTemplate | undefined,
                                   next: ElementTemplateToDynamicNode): ElementTemplateToDynamicNode {
  return (scope: ViewScope, elementTemplate: ElementTemplate) => {
    const viewTemplate = getViewTemplate(elementTemplate.name);
    if (viewTemplate) {
      let actionHandler: ActionHandler;
      const handleAction = (name: string, action: Action) => {
        actionHandler?.(name, action);
      };
      const viewElementTemplate = newApplyViewTemplate(elementTemplate, viewTemplate);
      const getEventListener = (name: string) => partial(handleAction, name);
      let childScope = { ...scope, getEventListener};
      const result = next(childScope, viewElementTemplate);
      if (viewTemplate.actionMap) {
        const handler = (a: Action) => {
        const event = toEvent(a);
        result.node.dispatchEvent(event);
      };
        actionHandler = createActionHandler(scope.node, handler, viewTemplate.actionMap);
      }

      return result;
    }
    return next(scope, elementTemplate);

  };

}
