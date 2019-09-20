import { Element } from '../../view/types-and-interfaces/elements/element';
import { VNode } from 'snabbdom/vnode';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict, partial } from '../../core';
import { give } from '../../core/functions/give';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { fromDict } from '../../core/functions/from-dict';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { ExtendableVNode } from '../types-and-interfaces/v-node/extendable-v-node';
import { createVNode } from './create-v-node';
import { Property } from '../../view/types-and-interfaces/property';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { elementHasProperty } from '../../view/functions/element/element-has-property';
import { getProperty } from '../../view';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';

export function createElementToVNode(extenders: ExtenderDescriptor[]): (element: Element) => ExtendableVNode {
  let elements: Dict<{ element: Element, node: ExtendableVNode }> = {};
  let propertyChanges: Dict<(props: Property[]) => void> = {};
  const elementToVNode = (element: Element) => {
    const existingElement: { element: Element, node: ExtendableVNode } | null = fromDict(elements, element.id);
    let init: ((el: any) => void) | null = null;
    if (existingElement) {
      let oldElement = existingElement.element;
      const unchanged = oldElement === element;
      if (unchanged) {
        return existingElement.node;
      }
      const propertiesChanged = propertyChanges[element.id];
      if (propertiesChanged) {
        propertiesChanged(element.properties);
      }
    } else {

      const appliedExtenders: ExtenderDescriptor[] = extenders.filter(ext => elementHasProperty(element, ext.name));
      let oldProperties: Property[] | null = null;
      if (appliedExtenders.length) {
        const initExtenders = (nativeElement: any) => {
          const results = appliedExtenders.map(e => e.initiateExtender(nativeElement));
          const updates = results.map(r => r.update);
          /*const destroys = results.map(r => {
            return r.onBeforeDestroy || (() => { });
          });*/

          const propertiesChanged: (props: Property[]) => void = (newProperties: Property[]) => {
            updates.forEach((update, index) => {
              const getPropertyForExtender = partial(getProperty, appliedExtenders[index].name);
              const newProperty = getPropertyForExtender(newProperties as any) as any;
              const newValue = newProperty.value;
              let oldValue;
              if (oldProperties) {
                const oldAttribute = getPropertyForExtender(oldProperties as any);
                if (oldAttribute) {
                  oldValue = oldAttribute.value;
                }
              }
              update(newValue, oldValue, newProperties);
            });
            oldProperties = newProperties;
          };
          propertyChanges[element.id] = propertiesChanged;
          propertiesChanged(element.properties);
            /*
          (vNode as ExtendedVNode).propertiesChanged = propertiesChanged;
          propertiesChanged(vNode.properties);
          (vNode as ExtendedVNode).destroy = () => {
            destroys.forEach(d => d());
          };
          */
        };
        init = initExtenders;

      } else {
        //check components
      }
      //check if an extender or a component exists for this element, if so prepare an init function and add to the vnode, might need to move it down.
      //let that function just take an element, and then supply the properties from the element, use the return value of today *Result for start.
    }
    let data: any = {
      attrs: arrayToDict(a => a.value, 'name', element.properties),
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict(h => h.handler, 'for', handlers);
    }

    const children = isStaticElement(element) ? element.content.map(c => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let node: ExtendableVNode = createVNode(element, data, children);
    if (isLiveElement(element)) {
      const stream: Observable<VNode> = element.childStream.pipe(map(
        (streamedChildren: Array<Element | string>) => {
          const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
          return createVNode(element, data, children);
        }
      ));
      const extended = node as StreamVNode;
      extended.contentStream = stream;
    }
    if (init) {
      const extended = node as ExtendedVNode;
      extended.init = init;
    }
    elements = give(elements, { element, node }, element.id);
    return node;
  };
  return elementToVNode;
}
