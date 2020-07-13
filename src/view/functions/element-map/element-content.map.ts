import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';

export function elementContentMap(elementMap: (template: ElementTemplate) => ModelToElement | ModelToElements | ModelToString,
                                  content: ElementTemplate | ModelToString): ModelToElement | ModelToElements | ModelToString {

  const contentMap: (t: ElementTemplate | ModelToString) => ModelToElement | ModelToElements | ModelToString =
    (template: ElementTemplate | ModelToString) => {
      if (typeof template === 'function') {
        return template;
      }
      return elementMap(template);
    };

  return contentMap(content);
}
