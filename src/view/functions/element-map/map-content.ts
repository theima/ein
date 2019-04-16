import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { isMappedSlot } from '../type-guards/is-mapped-slot';

export function mapContent(id: string,
                           content: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                           model: object,
                           insertedContentModel: object): Array<Element | string> {
  const contentModel = model;
  return content
    .map(e => {
      if (typeof e === 'object') {
        if (e.content) {
          return e;
        }
        return null;
      }
      return e(contentModel, insertedContentModel);
    }).reduce((all: Array<string | Element>, item: string | MappedSlot | Element | Array<Element | string> | null) => {
      if (item !== null) {
        if (Array.isArray(item)) {
          all = all.concat(item);
        } else if (isMappedSlot(item)) {
          const slotModel = item.mappedFor === id ? contentModel : insertedContentModel;
          all = all.concat(mapContent(id, (item as any).content, slotModel, slotModel));
        } else {
          all.push(item);
        }
      }
      return all;
    }, []);
}
