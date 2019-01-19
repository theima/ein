import { Element } from '../../types-and-interfaces/elements/element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToString } from '../../types-and-interfaces/model-to-string';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ModelMap } from '../..';
import { MappedSlot } from '../../types-and-interfaces/slots/mapped.slot';
import { isMappedSlot } from '../type-guards/is-mapped-slot';

export function mapContent(id: string,
                           insertedContentOwnerId: string,
                           content: Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                           model: object,
                           insertedContentModel: object,
                           map: ModelMap = m => m): Array<Element | string> {
  const contentModel = map(model);
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
          const slotId = item.mappedFor === id ? id : insertedContentOwnerId;
          all = all.concat(mapContent(id, slotId, (item as any).content, model, slotModel));
        } else {
          all.push(item);
        }
      }
      return all;
    }, []);
}
