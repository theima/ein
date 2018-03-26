import { EmceRenderData, RenderData, Property } from '../../view';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { templateToRenderData } from './template-to-render-data';
import { TemplateAttribute } from '../types-and-interfaces/template-attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';

export function templateToEmceRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                         propertyMap: (property: TemplateAttribute) => (m: object) => Property,
                                         templateToData: (t: TemplateElement) => RenderData,
                                         templateElement: TemplateElement,
                                         viewData: EmceViewData): EmceRenderData {
  const renderData = templateToRenderData(templateStringMap, propertyMap, templateToData, templateElement, viewData);
  let content: Array<RenderData | ModelToString> = renderData.content;
  const streamSelector = new EventStreamSelector(content);
  const actions = viewData.actions(streamSelector);
  content = streamSelector.getData();
  return {
    ...renderData,
    content,
    isNode: true,
    modelMap: viewData.createModelMap(templateElement.attributes),
    createChildWith: viewData.createChildFrom(templateElement.attributes),
    executorOrHandlers: viewData.executorOrHandlers,
    actions
  };
}
