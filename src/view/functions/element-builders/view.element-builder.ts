import { Action, partial, Value } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { ActionHandler } from '../../types-and-interfaces/to-element/action-handler';
import { DynamicElement } from '../../types-and-interfaces/to-element/dynamic-element';
import { TemplateToElement } from '../../types-and-interfaces/to-element/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-element/view-scope';
import { ViewTemplate } from '../../types-and-interfaces/view-template/view-template';
import { contentToUpdate } from '../template-to-element/content-to-update';
import { createActionHandler } from './action-handling/create-action-handler';
import { applyViewTemplate } from './apply-view-template';
import { toEvent } from './view-builder/to-event';

export function viewElementBuilder(getViewTemplate: (name: string) => ViewTemplate | undefined,
                                   toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicElement[]) {
  return (next: TemplateToElement): TemplateToElement => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const viewTemplate = getViewTemplate(elementTemplate.name);
      if (viewTemplate) {
        let actionHandler: ActionHandler;
        const handleAction = (name: string, action: Action) => {
          actionHandler?.(name, action);
        };
        const viewElementTemplate = applyViewTemplate(elementTemplate, viewTemplate);
        const getEventListener = (name: string) => partial(handleAction, name);
        const content = elementTemplate.content;
        let slotContentUpdate: ModelUpdate | undefined;
        const getContent = () => {
          const dynamicContent = toContent(scope, content);
          slotContentUpdate = contentToUpdate(dynamicContent);
          return dynamicContent.map((d) => d.element);
        };
        let childScope: ViewScope = { ...scope, getActionListener: getEventListener, getContent };
        const result = next(childScope, viewElementTemplate);
        if (viewTemplate.actionMap) {
          const handler = (a: Action) => {
            const event = toEvent(a);
            result.element.dispatchEvent(event);
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
