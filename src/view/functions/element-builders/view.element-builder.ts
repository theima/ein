import { Action } from '../../../core';
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
import { toGetActionListener } from './action-handling/to-get-action-listener';
import { applyViewTemplate } from './apply-view-template';
import { addContentUpdate } from './view-builder/add-content-update';
import { createViewActionHandler } from './view-builder/create-view-action-handler';
import { getMap } from './view-builder/get-map';

export function viewElementBuilder(getViewTemplate: (name: string) => ViewTemplate | undefined,
                                   toContent: (scope: ViewScope, content: ElementTemplateContent[]) => DynamicContent[]) {
  return (next: TemplateToElement): TemplateToElement => {
    return (scope: ViewScope, elementTemplate: ElementTemplate) => {
      const viewTemplate = getViewTemplate(elementTemplate.name);
      if (viewTemplate) {
        const map = getMap(elementTemplate);
        let viewActionHandler: ActionHandler | undefined;
        const actionHandler = (name: string, detail: Record<string, unknown>, action: Action) => {
          viewActionHandler?.(name, detail, action);
        };
        let slotContentUpdate: ModelUpdate | undefined;
        let slotContentDestroy: ElementDestroy | undefined;
        const handleContent = (elementAdder: (element: ChildNode) => void) => {
          const dynamicContent = toContent(scope, elementTemplate.content);
          [slotContentUpdate, slotContentDestroy] = setContent(dynamicContent, elementAdder);
        };
        const childScope: ViewScope = { ...scope, getActionListener: toGetActionListener(actionHandler), handleContent };
        let result = next(childScope, applyViewTemplate(elementTemplate, viewTemplate));

        viewActionHandler = createViewActionHandler(map, result.element, scope.node, viewTemplate.actionMap);

        result = addOnDestroy(result, slotContentDestroy);
        result = addContentUpdate(map, result, slotContentUpdate);
        return result;
      }
      return next(scope, elementTemplate);

    };

  };

}
