import { get, Dict } from '../../core';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { RenderData } from '../types-and-interfaces/render-data';
import { toRenderData } from './to-render-data';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { toEmceRenderData } from './to-emce-render-data';

export function createRenderData(viewDict: Dict<ViewData | EmceViewData>, templateElement: TemplateElement): RenderData {
  let create: (templateElement: TemplateElement,
               usedViews?: string[]) => RenderData =
    (templateElement: TemplateElement,
     usedViews: string[] = []) => {
      if (usedViews.indexOf(templateElement.name) !== -1) {
        // throwing for now.
        throw new Error('Cannot use view inside itself \'' + templateElement.name + '\'');
      }

      let name = templateElement.name;
      const viewData: ViewData | EmceViewData = get(viewDict, name);
      usedViews = viewData ? [...usedViews, name] : usedViews;
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
