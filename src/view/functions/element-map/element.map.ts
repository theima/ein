import { partial, Value } from '../../../core/index';
import { NodeAsync } from '../../../node-async/index';
import { ViewTemplate } from '../../index';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { applyModifiers } from '../apply-modifiers';
import { fillSlots } from '../fill-slots';
import { applyViewTemplate } from './apply-view-template';
import { elementContentMap } from './element-content.map';

export function elementMap(usedViews: string[],
                           getId: () => string,
                           getViewTemplate: (name: string) => ViewTemplate | null,
                           insertedContentOwnerId: string,
                           node: NodeAsync<Value>,
                           template: FilledElementTemplate): ModelToElementOrNull | ModelToElements {
  const viewTemplate: ViewTemplate | null = getViewTemplate(template.name);
  const updateUsedViews = (usedViews: string[], descriptor: ViewTemplate | null) => {
    if (usedViews.length > 1000) {
      // simple test
      // throwing for now.
      throw new Error('Too many nested views');
    }
    return descriptor ? [...usedViews, descriptor.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, viewTemplate);
  const contentMap =
    partial(
      elementContentMap,
      partial(elementMap, usedViews, getId, getViewTemplate, insertedContentOwnerId, node)
    );
  if (viewTemplate) {
    template = applyViewTemplate(template, viewTemplate, insertedContentOwnerId);
  }
  return applyModifiers(
    getId,
    contentMap,
    node,
    template
  );
}
