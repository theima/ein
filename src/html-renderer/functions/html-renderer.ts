import { Observable } from 'rxjs';
import { Element, ElementTemplate, ModelToElement, ElementTemplateDescriptor } from '../../view';
import { snabbdomRenderer } from './snabbdom-renderer';
import { VNode } from 'snabbdom/vnode';
import { createElementToVNode } from './create-element-to-v-node';
import { map } from 'rxjs/operators';
import { init } from 'snabbdom';
import * as eventModule from 'snabbdom/modules/eventlisteners';
import * as attributesModule from 'snabbdom/modules/attributes';
import { extenderModule } from '../snabbdom-modules/extender.module';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { extendedModule } from '../snabbdom-modules/extended.module';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { isHtmlComponentDescriptor } from './type-guards/is-html-component-descriptor';
import { componentModule } from '../snabbdom-modules/component.module';
import { HTMLComponentDescriptor } from '../types-and-interfaces/html-component.descriptor';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { Slot } from '../../view/types-and-interfaces/slots/slot';
import { Patch } from '../types-and-interfaces/patch';
import { Dict, Value, arrayToDict } from '../../core';
import { elementMap } from '../../view/functions/element-map/element.map';
import { FilledElementTemplate } from '../../view/types-and-interfaces/templates/filled.element-template';
import { NodeAsync } from '../../node-async';
import { ExtendableVNode } from '../types-and-interfaces/v-node/extendable-v-node';

export function HTMLRenderer(target: HTMLElement,
                             stream: Observable<Element>,
                             allExtenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>,
                             parser: (s: string) => Array<ElementTemplate | ModelToString | Slot>): void {
  let extenderDescriptors: ExtenderDescriptor[] = [];
  let componentDescriptors: ComponentDescriptor[] = [];
  let patch: Patch;
  const renderer = (target: HTMLElement | VNode, stream: Observable<VNode>) => {
    if (patch) {
      //when using `renderer` patch will always exist, since we start the rendering with the last call of this(HTMLRenderer) function.
      snabbdomRenderer(patch, target, stream);
    }
  };
  let components: Dict<ComponentDescriptor> = {};
  const getComponent: (n: string) => ComponentDescriptor | null = (name: string) => {
    return components[name] || null;
  };
  patch = init([
    eventModule.default,
    attributesModule.default,
    extenderModule(extenderDescriptors),
    componentModule(getComponent),
    extendedModule(renderer)
  ]);
  const elementToVNode: (element: Element) => VNode = createElementToVNode(patch);

  allExtenders.forEach(e => {
    if (isHtmlComponentDescriptor(e)) {

      const children: Array<ElementTemplate | ModelToString | Slot> = parser(e.children);

      const rootTemplate: FilledElementTemplate = {
        name: e.name,
        content: [],
        properties: []
      };
      const rootTemplateDescriptor: ElementTemplateDescriptor = {
        children,
        name: e.name,
        properties: []
      };
      let prefix = '';
      let idNumber = 0;
      const getId = () => {
        let id = prefix;
        if (idNumber) {
          if (!!id) {
            id += '-';
          }
          id +=idNumber;
        }
        idNumber++;
        return id;
      };
      const tempGetDescriptor = (name: string) => {
        if (name === e.name) {
          return rootTemplateDescriptor;
        }
        return null;
      };
      const createMap = (node: NodeAsync<Dict<Value | null>>, elementId: string) => {
        prefix = elementId;
        // We know it will be only one since no modifiers will run on this.
        const toElement: ModelToElement = elementMap([], getId, tempGetDescriptor, '1000', node as any, rootTemplate) as ModelToElement;
        const map = (properties: Dict<Value | null>) => {
          const el = toElement(properties, properties);
          let vnode = elementToVNode(el);
          //temporary hack to avoid loading component again for the vnode.
          delete (vnode as ExtendableVNode).extendable;
          return vnode;
        };
        return map;
      };

      componentDescriptors.push({
        name: e.name,
        init: e.init,
        createMap
      });
    } else {
      extenderDescriptors.push(e);
    }
  });
  components = arrayToDict('name', componentDescriptors);
  const contentStream = stream.pipe(map(elementToVNode));
  renderer(target, contentStream);
}
