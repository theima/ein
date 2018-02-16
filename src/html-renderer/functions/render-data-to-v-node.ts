import { RenderData } from '../../view/types-and-interfaces/render-data';
import { VNode } from 'snabbdom/vnode';
import { EmceAsync } from 'emce-async';
import { TemplateString } from '../../view/types-and-interfaces/template-string';
import { Property } from '../../view';

export function renderDataToVNode(emce: EmceAsync<any>,
                                  renderData: RenderData,
                                  elementMaps: Array<(m: object) => VNode | TemplateString>,
                                  propertyMaps: Array<(m: object) => Property>): VNode {


}
