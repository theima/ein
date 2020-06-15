import { Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';

export function modelToElementContent(content: Array<ModelToElement | ModelToString | ModelToElements>,
                                      contentModel: Value): Array<Element | string> {
  return content
    .map((e) => {
      return e(contentModel);
    }).reduce((all: Array<string | Element>, item: string | Element | Array<Element | string> | undefined) => {
      if (item !== undefined) {
        if (Array.isArray(item)) {
          all = all.concat(item);
        } else {
          all.push(item);
        }
      }
      return all;
    }, []);
}
