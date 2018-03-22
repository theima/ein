import { get, Dict, partial } from '../../core/';
import { RenderData } from '../../view/';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { templateToRenderData } from './template-to-render-data';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { templateToEmceRenderData } from './template-to-emce-render-data';
import { MapData } from '../';
import { templateMap } from './template.map';
import { propertyMap } from './property.map';

export function createRoot(viewDict: Dict<ViewData | EmceViewData>, mapDict: Dict<MapData>, viewName: string): RenderData {
  const tMap = templateMap(mapDict);
  const pMap = partial(propertyMap, tMap);
  const toEmceRenderData = partial(templateToEmceRenderData, pMap);
  const toRenderData = partial(templateToRenderData, pMap);
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
      const fromTemplate = (template: TemplateElement) => {
        return create(template, usedViews);
      };
      if (viewData && (viewData as any).createChildFrom) {
        return toEmceRenderData(templateElement, fromTemplate, viewData as any);
      }
      return toRenderData(templateElement, fromTemplate, viewData as any);

    };
  return create({
    name: viewName,
    content: [],
    attributes: [],
    dynamicAttributes: []
  });
}
