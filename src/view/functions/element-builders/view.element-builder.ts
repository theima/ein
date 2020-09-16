import { Action, partial } from '../../../core';
import { ElementTemplate } from '../../types-and-interfaces/element-template/element-template';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { ModelUpdate } from '../../types-and-interfaces/model-update';
import { ActionHandler } from '../../types-and-interfaces/to-rendered-content/action-handler';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { ElementDestroy } from '../../types-and-interfaces/to-rendered-content/element-destroy';
import { TemplateToElement } from '../../types-and-interfaces/to-rendered-content/template-to-element';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';
import { ViewTemplate } from '../../types-and-interfaces/view-template/view-template';
import { addOnDestroy } from '../template-to-rendered-content/add-on-destroy';
import { setContent } from '../template-to-rendered-content/set-content';
import { createActionHandler } from './action-handling/create-action-handler';
import { applyViewTemplate } from './apply-view-template';
import { addContentUpdate } from './view-builder/add-content-update';
import { toEvent } from './view-builder/to-event';

export function viewElementBuilder(getViewTemplate: (name: string) => ViewTemplate | undefined,
                                   getId: () => number,
                                   toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicContent[]) {
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
        let slotContentDestroy: ElementDestroy | undefined;
        const handleContent = (elementAdder: (element: ChildNode) => void) => {
          const dynamicContent = toContent(scope, content);
          [slotContentUpdate, slotContentDestroy] = setContent(dynamicContent, elementAdder);
        };
        let childScope: ViewScope = { ...scope, getActionListener: getEventListener, handleContent };
        let result = next(childScope, viewElementTemplate);
        if (viewTemplate.actionMap) {
          const handler = (a: Action) => {
            const event = toEvent(a);
            result.element.dispatchEvent(event);
          };
          actionHandler = createActionHandler(scope.node, handler, viewTemplate.actionMap);
        }

        if (slotContentDestroy) {
          result = addOnDestroy(result, slotContentDestroy);
        }
        result = addContentUpdate(elementTemplate, result, slotContentUpdate);
        return result;
      }
      return next(scope, elementTemplate);

    };

  };

}
