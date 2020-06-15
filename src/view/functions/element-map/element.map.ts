import { partial, Value } from '../../../core/index';
import { NodeAsync } from '../../../node-async/index';
import { ViewTemplate } from '../../index';
import { ModelToElement } from '../../types-and-interfaces/elements/model-to-element';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { ElementTemplate } from '../../types-and-interfaces/templates/element-template';
import { applyModifiers } from '../apply-modifiers';
import { applyViewTemplate } from './apply-view-template';

export function elementMap(usedViews: string[],
                           getId: () => string,
                           getViewTemplate: (name: string) => ViewTemplate | undefined,
                           insertedContentOwnerId: string,
                           node: NodeAsync<Value>,
                           template: ElementTemplate): ModelToElement | ModelToElements {
  const viewTemplate: ViewTemplate | undefined = getViewTemplate(template.name);
  const updateUsedViews = (usedViews: string[], descriptor: ViewTemplate | undefined) => {
    if (usedViews.length > 1000) {
      // simple test
      // throwing for now.
      throw new Error('Too many nested views');
    }
    return descriptor ? [...usedViews, descriptor.name] : usedViews;
  };
  usedViews = updateUsedViews(usedViews, viewTemplate);
  const contentElementMap = partial(elementMap, usedViews, getId, getViewTemplate, insertedContentOwnerId, node);
  if (viewTemplate) {
    template = applyViewTemplate(node, template, viewTemplate);
  }
  return applyModifiers(
    getId,
    contentElementMap,
    node,
    template
  );
}
