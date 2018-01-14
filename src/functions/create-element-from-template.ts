import {TemplateElement} from '../types-and-interfaces/template-element';
import {fromTemplate} from './from-template';
import {Dict} from '../types-and-interfaces/dict';
import {ViewData} from '../types-and-interfaces/view-data';
import {Element} from '../types-and-interfaces/element';
import {toSnabbdomNode} from './to-snabbdom-node';
import {Tag} from '../types-and-interfaces/tag';
import {useViewForTemplateElement} from './use-view-for-template-element';
import {Attribute} from '../';
import {attributeMap} from './attribute-map';
import {TemplateString} from '../types-and-interfaces/template-string';
import {DynamicAttribute} from '../types-and-interfaces/dynamic-attribute';

export function createElementFromTemplate(views: Dict<ViewData>): (templateElement: TemplateElement) => (model: any) => Element {
  let elementFromTemplate: (templateElement: TemplateElement, usedTags?: string[]) => (model: any) => Element =
    (templateElement: TemplateElement, tags: string[] = []) => {
      if (tags.indexOf(templateElement.tag) !== -1) {
        // throwing for now.
        throw new Error('Cannot use element inside itself');
      }
      templateElement = useViewForTemplateElement(templateElement, views[templateElement.tag]);
      let children: Array<(m: any) => Element | TemplateString> = templateElement.children.map((c: TemplateElement | string) => {
        if (typeof c === 'string') {
          return fromTemplate(c);
        }
        return elementFromTemplate(c, [...tags, templateElement.tag]);
      });
      let attributeMaps: Array<(m: any) => Attribute> = templateElement.dynamicAttributes.map(
        (a: DynamicAttribute) => {
          return attributeMap(a);
        }
      );
      return (model: any) => {
        let t: Tag = {
          name: templateElement.tag
        };
        t.attributes = templateElement.attributes.concat(
          attributeMaps.map(map => map(model))
        );

        return toSnabbdomNode(t, children.map(c => c(model)), templateElement.eventHandlers);
      };
    };

  return elementFromTemplate;
}
