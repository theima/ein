import { partial, Value } from '../../../core/index';
import { NodeAsync } from '../../../node-async/index';
import { ViewTemplate } from '../../index';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { applyModifiers } from '../apply-modifiers';
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
    // mapped slots are created here the templates in the slots are mapped to modelToElement and later sent the different id in to map those elements with the owners model.
    partial(
      elementContentMap,
      partial(elementMap, usedViews, getId, getViewTemplate, insertedContentOwnerId, node)
    );
  if (viewTemplate) {
    // filled slots created, they have the id for the owner of the slot. it has a content of templates that will be mapped by the content map above...
    template = applyViewTemplate(usedViews, getId, getViewTemplate, node, template, viewTemplate, insertedContentOwnerId);
  }
  // VI kanske ska lägga till en ström då som kommer in för sloten och som postas på vid model uppdatering
  // vi kan analysera och se om det inte finns nån slot i komponenten och det är där som vi kan lägga in en content stream för sloten...
  //
  // hur hanteras borttagendet av slot i dag?...
  return applyModifiers(
    getId,
    contentMap,
    node,
    template
  );
}
