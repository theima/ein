import { EmceViewRenderData } from '../../view/types-and-interfaces/emce-render-data';
import { RenderData } from '../../view/types-and-interfaces/render-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { createContent } from './create-content';

export function toEmceRenderData(templateElement: TemplateElement,
                                 templateToData: (t: TemplateElement) => RenderData,
                                 viewData: EmceViewData): EmceViewRenderData {
  const templateContent = createContent(templateElement, viewData);
  let content: Array<RenderData | TemplateString> = templateContent.map(
    (template: TemplateElement | TemplateString) => {
      if (typeof template === 'string') {
        return template;
      }
      return templateToData(template);
    });
  const streamSelector = new EventStreamSelector(content as any);
  const actions = viewData.actions(streamSelector);
  content = streamSelector.getData();
  return {
    id: templateElement.id,
    name: templateElement.name,
    content,
    properties: templateElement.properties,
    dynamicProperties: templateElement.dynamicProperties,
    isNode: true,
    templateValidator: viewData.templateValidator,
    modelMap: viewData.modelMap,
    createChildFrom: viewData.createChildFrom,
    executorOrHandlers: viewData.executorOrHandlers,
    actions
  };
}
