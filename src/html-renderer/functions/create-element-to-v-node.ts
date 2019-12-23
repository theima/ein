import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { isArray } from 'rxjs/internal/util/isArray';
import { map } from 'rxjs/operators';
import { VNode } from 'snabbdom/vnode';
import { Action, ActionMap, Dict, NullableValue, partial, Value, withMixins } from '../../core';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';
import { fromDict } from '../../core/functions/from-dict';
import { give } from '../../core/functions/give';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { asyncMixin, NodeAsync } from '../../node-async';
import { getProperty } from '../../view';
import { elementMap } from '../../view/functions/element-map/element.map';
import { mapContent } from '../../view/functions/element-map/map-content';
import { hasProperty } from '../../view/functions/has-property';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { Element } from '../../view/types-and-interfaces/elements/element';
import { Property } from '../../view/types-and-interfaces/property';
import { FilledSlot } from '../../view/types-and-interfaces/slots/filled.slot';
import { FilledElementTemplate } from '../../view/types-and-interfaces/templates/filled.element-template';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { InitiateComponentResult } from '../types-and-interfaces/initiate-component-result';
import { NativeElement } from '../types-and-interfaces/native-element';
import { NativeEvent } from '../types-and-interfaces/native-event';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { createVNode } from './create-v-node';

export function createElementToVNode(extenders: ExtenderDescriptor[], componentTemplates: ComponentDescriptor[]): (element: Element) => VNode {
  let elements: Dict<{ element: Element, node: VNode }> = {};
  let propertyChanges: Dict<(props: Property[]) => void> = {};
  let idNumber = 0;
  const getComponentId = () => {
    return 'c' + idNumber++;
  };
  const toDict = (properties: Property[]) => {
    return arrayToKeyValueDict('name', 'value', properties);
  };

  const initComponent = (element: Element,
                         component: ComponentDescriptor,
                         children: Array<FilledElementTemplate | ModelToString | FilledSlot>,
                         childUpdateSubject: Subject<Array<Element | string>>,
                         setDestroy: (destroy: () => void) => void,
                         nativeElement: NativeElement) => {
    const lastProperties = toDict(element.properties);
    const sendPropertyUpdate = (properties: Dict<NullableValue>) => {
      const updateAction: Action = {
        type: 'ComponentPropertyUpdate',
        properties
      };
      node.next(updateAction);
    };
    const updateContent = () => {
      sendPropertyUpdate({ ...lastProperties });
    };
    const initResult: InitiateComponentResult = component.init(nativeElement, updateContent);
    if (initResult.onBeforeDestroy) {
      setDestroy(initResult.onBeforeDestroy);
    }
    const actionMap: ActionMap<any> = (m: Dict<NullableValue>, a: Action) => {
      return a.properties || m;
    };

    const node: NodeAsync<Dict<NullableValue>> = withMixins(asyncMixin as any).create(actionMap, lastProperties) as any;
    const componentNode: NodeAsync<any> = node;
    const contentMap = partial(elementMap, [], getComponentId, () => null, getComponentId(), componentNode);
    const mappedContent = children.map((c) => typeof c === 'object' ? contentMap(c as any) : c);
    const toElements = (m: any) => {
      return mapContent('', mappedContent, m, m);
    };
    let stream: Observable<Dict<Value | null>> = componentNode as any;
    if (initResult.map) {
      stream = stream.pipe(map(initResult.map));
    }
    const childStream = stream.pipe(map(toElements));
    const nodeStreamSubscription = childStream.subscribe((s) => {
      childUpdateSubject.next(s);
    });
    const propertiesChanged = (newProperties: Property[]) => {
      sendPropertyUpdate(toDict(newProperties));
    };
    let eventSubscription: Subscription;
    if (initResult.events) {
      eventSubscription = initResult.events.subscribe((e: NativeEvent) => {
        // placing the event on the queue of the event loop.
        setTimeout(
          () => {
            nativeElement.dispatchEvent(e);
          }
        );
      });
    }
    const onDestroy = () => {
      nodeStreamSubscription.unsubscribe();
      if (eventSubscription) {
        eventSubscription.unsubscribe();
      }
      if (initResult.onBeforeDestroy) {
        initResult.onBeforeDestroy();
      }
      // TODO: complete node.
    };
    propertyChanges[element.id] = propertiesChanged;
    return onDestroy;
  };

  const initExtenders = (element: Element, extenders: ExtenderDescriptor[], setDestroy: (destroy: () => void) => void, nativeElement: any) => {
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
    setDestroy(destroy);
    const propertiesChanged: (props: Property[]) => void = (newProperties: Property[]) => {
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
    propertyChanges[element.id] = propertiesChanged;
    propertiesChanged(element.properties);
  };

  const elementToVNode = (element: Element) => {
    const existing: { element: Element, node: VNode } | null = fromDict(elements, element.id);
    let init: ((el: any) => void) | null = null;
    let destroyFunction: () => void = () => { };
    let liveStream: Observable<Element | Array<Element | string>> | null = null;
    let stream: Observable<VNode> | null = null;
    const setDestroy = (func: () => void) => {
      destroyFunction = func;
    };
    if (existing) {
      let oldElement = existing.element;
      const unchanged = oldElement === element;
      if (unchanged) {
        return existing.node;
      }
      const propertiesChanged = propertyChanges[element.id];
      if (propertiesChanged) {
        propertiesChanged(element.properties);
      }
    } else {
      const appliedExtenders: ExtenderDescriptor[] = extenders.filter((ext) => hasProperty(element, ext.name));
      if (appliedExtenders.length) {
        init = partial(initExtenders, element, appliedExtenders, setDestroy);
      } else {
        let c: ComponentDescriptor | undefined = componentTemplates.find((c) => c.name === element.name);
        if (c) {
          const component: ComponentDescriptor = c;
          const children: Array<FilledElementTemplate | ModelToString | FilledSlot> = component.children as any;
          const childUpdates = new ReplaySubject<any>(1);
          liveStream = childUpdates;
          init = partial(initComponent, element, component, children, childUpdates, setDestroy);
        }
      }
      if (isLiveElement(element)) {
        liveStream = element.elementStream;
      }
    }
    let data: any = {
      attrs: arrayToDict((a) => a.value, 'name', element.properties),
      key: element.id
    };
    const handlers = element.handlers;
    if (handlers) {
      data.on = arrayToDict((h) => h.handler, 'for', handlers);
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
      extended.destroy = () => {
        destroyFunction();
      };
    }
    if (stream) {
      const extended = vNode as StreamVNode;
      extended.contentStream = stream;
    }
    elements = give(elements, { element, node: vNode }, element.id);
    return vNode;
  };
  return elementToVNode;
}
