import { get, Dict } from '../../core/';
import { RenderData } from '../../view/';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { toRenderData } from './to-render-data';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { toEmceRenderData } from './to-emce-render-data';

export function createRoot(viewDict: Dict<ViewData | EmceViewData>, viewName: string): RenderData {
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
      const toTemplate = (template: TemplateElement) => {
        return create(template, usedViews);
      };
      if (viewData && (viewData as any).createChildFrom) {
        return toEmceRenderData(templateElement, toTemplate, viewData as any);
      }
      return toRenderData(templateElement, toTemplate, viewData as any);

    };
  return create({
    name: viewName,
    content: [],
    properties: [],
    dynamicProperties: []
  });
}
