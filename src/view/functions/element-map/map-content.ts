import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelMap } from '../..';

export function mapContent(content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                           model: object,
                           map: ModelMap = m => m): Array<Element | string> {
  const contentModel = map(model);
  return content
    .map(e => e(contentModel))
    .reduce((all: Array<string | Element>, item: string | Element | Element[] | null) => {
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
