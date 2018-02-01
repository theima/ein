import { EmceViewRenderData } from '../types-and-interfaces/emce-view-render-data';
import { RenderData } from '../types-and-interfaces/render-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { VNode } from 'snabbdom/vnode';
import { Emce } from 'emce';
import { TemplateString } from '../types-and-interfaces/template-string';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';

export function toEmceViewRenderData(templateElement: TemplateElement,
                                     childToData: (t: TemplateElement) => RenderData,
                                     viewData: EmceViewData,
                                     renderer: (e: VNode, emce: Emce<any>, data: RenderData) => void): EmceViewRenderData {
  let children: Array<RenderData | TemplateString> = viewData.children.map(
    (child: TemplateElement | TemplateString) => {
      if (typeof child === 'string') {
        return child;
      }
      return childToData(child);
    });
  return {
    id: templateElement.id,
    tag: templateElement.tag,
    children,
    properties: templateElement.properties,
    dynamicProperties: templateElement.dynamicProperties,
    renderer,
    templateValidator: viewData.templateValidator,
    modelMap: viewData.modelMap,
  };
}
