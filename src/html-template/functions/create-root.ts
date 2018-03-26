import { get, Dict, partial } from '../../core/';
import { RenderData } from '../../view/';
import { ViewData } from '../types-and-interfaces/view-data';
import { TemplateElement } from '../types-and-interfaces/template-element';
import { templateToRenderData } from './template-to-render-data';
import { EmceViewData } from '../types-and-interfaces/emce-view-data';
import { templateToEmceRenderData } from './template-to-emce-render-data';
import { MapData } from '../types-and-interfaces/map-data';
import { templateMap } from './template.map';
import { propertyMap } from './property.map';
import { templateStringMap } from './template-string.map';

export function createRoot(viewDict: Dict<ViewData | EmceViewData>, mapDict: Dict<MapData>, viewName: string): RenderData {
  const tMap = partial(templateMap, mapDict);
  const pMap = partial(propertyMap, tMap);
  const sMap = partial(templateStringMap, tMap);
  const toEmceRenderData = partial(templateToEmceRenderData, sMap, pMap);
  const toRenderData = partial(templateToRenderData, sMap, pMap);

  let create: (templateElement: TemplateElement,
               usedViews?: string[]) => RenderData =
    (templateElement: TemplateElement,
     usedViews: string[] = []) => {
      if (usedViews.length > 1000) {
        //simple test
        //throwing for now.
        throw new Error('Too many nested views');
      }

      let name = templateElement.name;
      const viewData: ViewData | EmceViewData = get(viewDict, name);
      usedViews = viewData ? [...usedViews, name] : usedViews;
      const fromTemplate = (template: TemplateElement) => {
        return create(template, usedViews);
      };
      if (viewData) {
        if (!viewData.templateValidator(templateElement.attributes)) {
          // just throwing for now until we have decided on how we should handle errors.
          throw new Error('missing required property for \'' + viewData.name + '\'');
        }
      }
      if (viewData && (viewData as any).createChildFrom) {
        return toEmceRenderData(fromTemplate, templateElement, viewData as any);
      }
      return toRenderData(fromTemplate, templateElement, viewData as any);

    };
  return create({
    name: viewName,
    content: [],
    attributes: [],
    dynamicAttributes: []
  });
}
