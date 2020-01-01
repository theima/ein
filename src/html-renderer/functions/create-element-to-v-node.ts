import { Observable } from 'rxjs';
import { isArray } from 'rxjs/internal/util/isArray';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Dict, partial } from '../../core';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';
import { fromDict } from '../../core/functions/from-dict';
import { give } from '../../core/functions/give';
import { getProperty } from '../../view';
import { hasProperty } from '../../view/functions/has-property';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { Property } from '../../view/types-and-interfaces/property';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { EinVNode } from '../types-and-interfaces/v-node/ein-v-node';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { createVNode } from './create-v-node';
import { initComponent } from './init-component';

export function createElementToVNode(extenders: ExtenderDescriptor[], componentTemplates: ComponentDescriptor[]): (element: Element) => VNode {
  let elements: Dict<{ element: Element, node: VNode }> = {};
  let idNumber = 0;
  const getComponentId = () => {
    return 'c' + idNumber++;
  };
  const toDict = (properties: Property[]) => {
    return arrayToKeyValueDict('name', 'value', properties);
  };
  const mapComponentContent = (c: Element | string) => typeof c === 'object' ? elementToVNode(c) : c;

  const initExtenders = (element: Element, extenders: ExtenderDescriptor[], nativeElement: any) => {
    let oldProperties: Property[] | null = null;
    const results = extenders.map((e) => e.initiateExtender(nativeElement));
    const updates = results.map((r) => r.update);
    const destroy = () => {
      results.forEach((r) => {
        if (r.onBeforeDestroy) {
          r.onBeforeDestroy();
        }
      });
    };
    const propertyChange: (props: Property[]) => void = (newProperties: Property[]) => {
      updates.forEach((update, index) => {
        const getPropertyForExtender = partial(getProperty, extenders[index].name);
        const newProperty = getPropertyForExtender(newProperties as any) as any;
        const newValue = newProperty.value;
        let oldValue;
        if (oldProperties) {
          const oldAttribute = getPropertyForExtender(oldProperties as any);
          if (oldAttribute) {
            oldValue = oldAttribute.value;
          }
        }
        update(newValue, oldValue, toDict(newProperties));
      });
      oldProperties = newProperties;
    };
    propertyChange(element.properties);
    return {
      destroy,
      propertyChange
    };
  };

  const elementToVNode = (element: Element) => {
    const existing: { element: Element, node: VNode } | null = fromDict(elements, element.id);
    let init = null;
    let liveStream: Observable<Element | Array<Element | string>> | null = null;
    let stream: Observable<VNode> | null = null;
    let data: any = {
      attrs: arrayToDict((a) => a.value, 'name', element.properties),
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict((h) => h.handler, 'for', handlers);
    }

    if (existing) {
      let oldElement = existing.element;
      const unchanged = oldElement === element;
      if (unchanged) {
        return existing.node;
      }
    } else {
      const appliedExtenders: ExtenderDescriptor[] = extenders.filter((ext) => hasProperty(element, ext.name));
      if (appliedExtenders.length) {
        init = partial(initExtenders, element, appliedExtenders);
      } else {
        let c: ComponentDescriptor | undefined = componentTemplates.find((c) => c.name === element.name);
        if (c) {
          const component: ComponentDescriptor = c;
          init = partial(initComponent, getComponentId, mapComponentContent,component, element, data);
        }
      }
      if (isLiveElement(element)) {
        liveStream = element.elementStream;
      }
    }

    const children = isStaticElement(element) ? element.content.map((c) => typeof c === 'object' ? elementToVNode(c) : c) : [];
    let vNode: VNode = createVNode(element, data, children);
    if (liveStream) {
      stream = liveStream.pipe(map(
        (item: Element | Array<Element | string>) => {
          if (isArray(item)) {
            const children = item.map((c) => typeof c === 'object' ? elementToVNode(c) : c);
            return createVNode(element, data, children);
          }
          return elementToVNode(item);
        }
      ));
    }
    if (init) {
      const extended = vNode as ExtendedVNode;
      extended.init = init;
    }
    if (stream) {
      const extended = vNode as StreamVNode;
      extended.contentStream = stream;
    }
    const p = vNode as EinVNode;
    p.properties = element.properties;
    elements = give(elements, { element, node: vNode }, element.id);
    return vNode;
  };
  return elementToVNode;
}
