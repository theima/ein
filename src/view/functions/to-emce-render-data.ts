import { EmceViewRenderData } from '../types-and-interfaces/emce-render-data';
import { RenderData } from '../types-and-interfaces/render-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { VNode } from 'snabbdom/vnode';
import { Emce } from 'emce';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { EmceAsync } from 'emce-async';
import { EventStreamSelector } from '../event-stream-selector';

export function toEmceRenderData(templateElement: TemplateElement,
                                 childToData: (t: TemplateElement) => RenderData,
                                 viewData: EmceViewData,
                                 renderer: (e: VNode, emce: EmceAsync<any>, data: RenderData) => void): EmceViewRenderData {
  let children: Array<RenderData | TemplateString> = viewData.children.map(
    (child: TemplateElement | TemplateString) => {
      if (typeof child === 'string') {
        return child;
      }
      return childToData(child);
    });
  const streamSelector = new EventStreamSelector(children as any);
  const actions = viewData.actions(streamSelector);
  children = streamSelector.getData();
  return {
    id: templateElement.id,
    tag: templateElement.tag,
    children,
    properties: templateElement.properties,
    dynamicProperties: templateElement.dynamicProperties,
    renderer,
    templateValidator: viewData.templateValidator,
    modelMap: viewData.modelMap,
    createChildFrom: viewData.createChildFrom,
    executorOrHandlers: viewData.executorOrHandlers,
    actions
  };
}
