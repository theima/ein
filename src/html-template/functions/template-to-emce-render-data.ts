import { EmceViewRenderData, RenderData } from '../../view';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { templateToRenderData } from './template-to-render-data';
import { Property } from '../../view/types-and-interfaces/property';
import { Attribute } from '../types-and-interfaces/attribute';
import { ModelToString } from '../../view/types-and-interfaces/model-to-string';

export function templateToEmceRenderData(templateStringMap: (templateString: TemplateString) => (m: object) => string,
                                         propertyMap: (property: Attribute) => (m: object) => Property,
                                         templateToData: (t: TemplateElement) => RenderData,
                                         templateElement: TemplateElement,
                                         viewData: EmceViewData): EmceViewRenderData {
  const renderData = templateToRenderData(templateStringMap, propertyMap, templateToData, templateElement, viewData);
  let content: Array<RenderData | ModelToString> = renderData.content;
  const streamSelector = new EventStreamSelector(content);
  const actions = viewData.actions(streamSelector);
  content = streamSelector.getData();
  return {
    ...renderData,
    content,
    isNode: true,
    templateValidator: viewData.templateValidator,
    modelMap: viewData.modelMap,
    createChildFrom: viewData.createChildFrom,
    executorOrHandlers: viewData.executorOrHandlers,
    actions
  };
}
