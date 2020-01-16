import { partial, Value } from '../../../core/index';
import { NodeAsync } from '../../../node-async/index';
import { ViewTemplate } from '../../index';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { applyModifiers } from '../apply-modifiers';
import { applyViewTemplate } from './apply-view-template';
import { elementContentMap } from './element-content.map';

export function elementMap(usedViews: string[],
                           getId: () => string,
                           getViewTemplate: (name: string) => ViewTemplate | null,
                           insertedContentOwnerId: string,
                           node: NodeAsync<Value>,
                           template: ElementTemplate): ModelToElementOrNull | ModelToElements {
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
  template = applyViewTemplate(usedViews, getId, getViewTemplate, node, template, viewTemplate, insertedContentOwnerId);
  }
  return applyModifiers(
    getId,
    contentMap,
    node,
    template
  );
}
