import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';

export function elementContentMap(elementMap: (template: ElementTemplate) => ModelToElementOrNull | ModelToElements | ModelToString,
                                  template: ElementTemplate | ModelToString): ModelToElementOrNull | ModelToElements | ModelToString {

  const contentMap: (t: ElementTemplate | ModelToString) => ModelToElementOrNull | ModelToElements | ModelToString =
    (template: ElementTemplate | ModelToString) => {
      if (typeof template === 'function') {
        return template;
      }
      return elementMap(template);
    };
  return contentMap(template);
}
