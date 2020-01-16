import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';

export function mapContent(id: string,
                           content: Array<ModelToElementOrNull | ModelToString | ModelToElements>,
                           model: Value,
                           insertedContentModel: Value): Array<Element | string> {
  const contentModel = model;
  return content
    .map((e) => {
      return e(contentModel, insertedContentModel);
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
