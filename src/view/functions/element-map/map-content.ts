import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelMap } from '../..';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';

export function mapContent(content: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                           model: object,
                           map: ModelMap = m => m): Array<Element | string> {
  const contentModel = map(model);
  return content
    .map(e => {
      if (typeof e === 'object') {
        if (e.content) {
          return mapContent(e.content, model);
        }
        return null;
      }
      return e(contentModel);
    }).reduce((all: Array<string | Element>, item: string | Element | Array<Element | string> | null) => {
      if (item !== null) {
        if (Array.isArray(item)) {
          all = all.concat(item);
        } else {
          all.push(item);
        }
      }
      return all;
    }, []);
}
