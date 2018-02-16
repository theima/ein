import { get } from '../../core/functions/get';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { Dict } from '../../core/types-and-interfaces/dict';
import { RenderData } from '../types-and-interfaces/render-data';
import { toRenderData } from './to-render-data';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { toEmceRenderData } from './to-emce-render-data';

export function createRenderData(viewDict: Dict<ViewData | EmceViewData>, templateElement: TemplateElement): RenderData {
  let create: (templateElement: TemplateElement,
               usedViews?: string[]) => RenderData =
    (templateElement: TemplateElement,
     usedViews: string[] = []) => {
      if (usedViews.indexOf(templateElement.tag) !== -1) {
        // throwing for now.
        throw new Error('Cannot use view inside itself \'' + templateElement.tag + '\'');
      }

      let tag = templateElement.tag;
      const viewData: ViewData | EmceViewData = get(viewDict, tag);
      usedViews = viewData ? [...usedViews, tag] : usedViews;
      const toChild = (child: TemplateElement) => {
        return create(child, usedViews);
      };
      if (viewData && (viewData as any).createChildFrom) {
        return toEmceRenderData(templateElement, toChild, viewData as any);
      }
      return toRenderData(templateElement, toChild, viewData as any);

    };
  return create(templateElement);
}
