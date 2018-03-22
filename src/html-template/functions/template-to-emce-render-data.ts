import { EmceViewRenderData, RenderData } from '../../view';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { EventStreamSelector } from '../../view/event-stream-selector';
import { templateToRenderData } from './template-to-render-data';
import { Property } from '../../view/types-and-interfaces/property';
import { DynamicProperty } from '../types-and-interfaces/dynamic-property';

export function templateToEmceRenderData(propertyMap: (property: DynamicProperty) => (m: object) => Property,
                                         templateElement: TemplateElement,
                                         templateToData: (t: TemplateElement) => RenderData,
                                         viewData: EmceViewData): EmceViewRenderData {
  const renderData = templateToRenderData(propertyMap, templateElement, templateToData, viewData);
  let content: Array<RenderData | TemplateString> = renderData.content;
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
