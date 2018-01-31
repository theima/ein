import { get } from '../../core/functions/get';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { Dict } from '../../core/types-and-interfaces/dict';
import { VNode } from 'snabbdom/vnode';
import { Emce } from 'emce';
import { RenderData } from '../types-and-interfaces/render-data';
import { toViewRenderData } from './to-view-render-data';

export function createRenderData(viewDict: Dict<ViewData>): (t: TemplateElement, renderer: (e: VNode, m: Emce<any>, data: RenderData) => void) => RenderData {
  let toRenderData: (templateElement: TemplateElement, renderer: (e: VNode, emce: Emce<any>, data: RenderData) => void, usedViews?: string[]) => RenderData =
    (templateElement: TemplateElement, renderer: (e: VNode, emce: Emce<any>, data: RenderData) => void, usedViews: string[] = []) => {
      if (usedViews.indexOf(templateElement.tag) !== -1) {
        // throwing for now.
        throw new Error('Cannot use view inside itself \'' + templateElement.tag + '\'');
      }

      let tag = templateElement.tag;
      const viewData: ViewData = get(viewDict, tag);
      usedViews = viewData ? [...usedViews, tag] : usedViews;
      return toViewRenderData(templateElement,(child: TemplateElement) => {
        return toRenderData(child, renderer, usedViews);
      }, viewData);
    };
  return toRenderData;
}
