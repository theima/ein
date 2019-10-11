import { Element } from '../../view/types-and-interfaces/elements/element';
import { VNode } from 'snabbdom/vnode';
import { arrayToDict } from '../../core/functions/array-to-dict';
import { Dict, partial, Value, withMixins, ActionMap, Action } from '../../core';
import { give } from '../../core/functions/give';
import { isStaticElement } from '../../view/functions/type-guards/is-static-element';
import { fromDict } from '../../core/functions/from-dict';
import { isLiveElement } from '../../view/functions/type-guards/is-live-element';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { StreamVNode } from '../types-and-interfaces/v-node/stream-v-node';
import { createVNode } from './create-v-node';
import { Property } from '../../view/types-and-interfaces/property';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { elementHasProperty } from '../../view/functions/element/element-has-property';
import { getProperty } from '../../view';
import { ExtendedVNode } from '../types-and-interfaces/v-node/extended-v-node';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { FilledSlot } from '../../view/types-and-interfaces/slots/filled.slot';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { FilledElementTemplate } from '../../view/types-and-interfaces/templates/filled.element-template';
import { elementMap } from '../../view/functions/element-map/element.map';
import { NodeAsync, asyncMixin } from '../../node-async';
import { mapContent } from '../../view/functions/element-map/map-content';
import { arrayToKeyValueDict } from '../../core/functions/array-to-key-value-dict';

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
                         nativeElement: any) => {
    const lastProperties = toDict(element.properties);
    const sendPropertyUpdate = (properties: Dict<Value | null>) => {
      const updateAction: Action = {
        type: 'ComponentPropertyUpdate',
        properties
      };
      node.next(updateAction);
    };
    const updateContent = () => {
      sendPropertyUpdate({ ...lastProperties });
    };
    const initResult = component.init(nativeElement, updateContent);
    const actionMap: ActionMap<any> = (m: Dict<Value | null>, a: Action) => {
      return a.properties || m;
    };

    const node: NodeAsync<Dict<Value | null>> = withMixins(asyncMixin as any).create(actionMap, lastProperties) as any;
    const componentNode: NodeAsync<any> = node;
    const contentMap = partial(elementMap, [], getComponentId, () => null, getComponentId(), componentNode);
    const mappedContent = children.map(c => typeof c === 'object' ? contentMap(c as any) : c);
    const toElements = (m: any) => {
      return mapContent('', mappedContent, m, m);
    };
    let stream: Observable<Dict<Value | null>> = componentNode as any;
    if (initResult.map) {
      stream = stream.pipe(map(initResult.map));
    }
    const childStream = stream.pipe(map(toElements));
    childStream.subscribe(s => {
      childUpdateSubject.next(s);
    });
    const propertiesChanged = (newProperties: Property[]) => {
      sendPropertyUpdate(toDict(newProperties));
    };
    /* TODO: Return to caller...
    const onDestroy = () => {
      if (result.onBeforeDestroy) {
        result.onBeforeDestroy();
      }
      //TODO: complete node.
    };
    */
    propertyChanges[element.id] = propertiesChanged;
  };

  const initExtenders = (element: Element, extenders: ExtenderDescriptor[], nativeElement: any) => {
          let oldProperties: Property[] | null = null;
          const results = extenders.map(e => e.initiateExtender(nativeElement));
          const updates = results.map(r => r.update);
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
              update(newValue, oldValue, newProperties);
            });
            oldProperties = newProperties;
          };
          propertyChanges[element.id] = propertiesChanged;
          propertiesChanged(element.properties);
        };

  const elementToVNode = (element: Element) => {
    const existing: { element: Element, node: VNode } | null = fromDict(elements, element.id);
    let init: ((el: any) => void) | null = null;
    let childStream: Observable<Array<Element | string>> | null = null;
    let stream: Observable<VNode> | null = null;
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
      const appliedExtenders: ExtenderDescriptor[] = extenders.filter(ext => elementHasProperty(element, ext.name));
      if (appliedExtenders.length) {
        init = partial(initExtenders, element, appliedExtenders);
      } else {
        let c: ComponentDescriptor | undefined = componentTemplates.find(c => c.name === element.name);
        if (c) {
          const component: ComponentDescriptor = c;
          const children: Array<FilledElementTemplate | ModelToString | FilledSlot> = component.children as any;
          const childUpdates = new ReplaySubject<any>(1);
          childStream = childUpdates;
          init = partial(initComponent, element, component, children, childUpdates);
        }
      }
      if (isLiveElement(element)) {
        childStream = element.childStream;
      }
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
    let node: VNode = createVNode(element, data, children);
    if (childStream) {
      stream = childStream.pipe(map(
        (streamedChildren: Array<Element | string>) => {
          const children = streamedChildren.map(c => typeof c === 'object' ? elementToVNode(c) : c);
          return createVNode(element, data, children);
        }
      ));
    }
    if (init) {
      const extended = node as ExtendedVNode;
      extended.init = init;
    }
    if (stream) {
      const extended = node as StreamVNode;
      extended.contentStream = stream;
    }
    elements = give(elements, { element, node }, element.id);
    return node;
  };
  return elementToVNode;
}
