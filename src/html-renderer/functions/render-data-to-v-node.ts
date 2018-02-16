import { RenderData } from '../../view/types-and-interfaces/render-data';
import { VNode } from 'snabbdom/vnode';
import { EmceAsync } from 'emce-async';
import { TemplateString } from '../../view/types-and-interfaces/template-string';
import { Property } from '../../view';
import { fromRenderData } from './from-render-data';
import { fromEmceViewRenderData } from './from-emce-view-render-data';

export function renderDataToVNode(emce: EmceAsync<any>,
                                  renderData: RenderData,
                                  elementMaps: Array<(m: object) => VNode | TemplateString>,
                                  propertyMaps: Array<(m: object) => Property>): (m: object) => VNode | string {

  if ((renderData as any).renderer) {
    return fromEmceViewRenderData(renderData as any, emce);
  }
  return fromRenderData(renderData as any, elementMaps, propertyMaps);
}
