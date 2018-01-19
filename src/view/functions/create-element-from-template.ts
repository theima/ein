import {TemplateElement} from '../types-and-interfaces/template-element';
import {templateStringMap} from './template-string.map';
import {Dict} from '../../core/types-and-interfaces/dict';
import {ViewData} from '../types-and-interfaces/view-data';
import {Element} from '../types-and-interfaces/element';
import {toSnabbdomNode} from './to-snabbdom-node';
import {Tag} from '../types-and-interfaces/tag';
import {getRenderData} from './get-render-data';
import {Property} from '../';
import {propertyMap} from './property.map';
import {TemplateString} from '../types-and-interfaces/template-string';
import {DynamicProperty} from '../types-and-interfaces/dynamic-property';
import {MapData} from '../types-and-interfaces/map-data';
import {templateMap} from './template.map';

export function createElementFromTemplate(views: Dict<ViewData>, maps: Dict<MapData>): (templateElement: TemplateElement) => (model: object) => Element {
  const tMap = templateMap(maps);
  let elementFromTemplate: (templateElement: TemplateElement, usedTags?: string[]) => (model: object) => Element =
    (templateElement: TemplateElement, usedTags: string[] = []) => {
      if (usedTags.indexOf(templateElement.tag) !== -1) {
        // throwing for now.
        throw new Error('Cannot use element inside itself');
      }
      const data = getRenderData(templateElement, views[templateElement.tag]);
      if (!data.templateValidator(data.properties)) {
        // just throwing for now until we have decided on how we should handle errors.
        throw new Error('missing required property for \'' + data.tag + '\'');
      }
      let elementMaps: Array<(m: object) => Element | TemplateString> =
        data.templates.map((c: TemplateElement | TemplateString) => {
        if (typeof c === 'string') {
          return templateStringMap(tMap, c);
        }
        return elementFromTemplate(c, [...usedTags, data.tag]);
      });
      let propertyMaps: Array<(m: object) => Property> = data.dynamicProperties.map(
        (a: DynamicProperty) => {
          return propertyMap(tMap, a);
        }
      );
      const modelMap = data.modelMap(data.properties);
      return (model: object) => {
        let t: Tag = {
          name: data.tag
        };
        // note that the properties are set with the parent model and should not use the viewMap
        t.properties = data.properties.concat(
          propertyMaps.map(map => map(model))
        );

        return toSnabbdomNode(t, elementMaps.map(c => c(modelMap(model))), templateElement.eventHandlers);
      };
    };

  return elementFromTemplate;
}
