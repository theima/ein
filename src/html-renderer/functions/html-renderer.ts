import { Observable } from 'rxjs';
import { Element, ElementTemplate } from '../../view';
import { snabbdomRenderer } from './snabbdom-renderer';
import { VNode } from 'snabbdom/vnode';
import { createElementToVNode } from './create-element-to-v-node';
import { map } from 'rxjs/operators';
import { init } from 'snabbdom';
import * as eventModule from 'snabbdom/modules/eventlisteners';
import * as attributesModule from 'snabbdom/modules/attributes';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { extendedModule } from '../snabbdom-modules/extended.module';
import { isHtmlComponentDescriptor } from './type-guards/is-html-component-descriptor';
import { HTMLComponentDescriptor } from '../types-and-interfaces/html-component.descriptor';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { Slot } from '../../view/types-and-interfaces/slots/slot';
import { Patch } from '../types-and-interfaces/patch';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';

export function HTMLRenderer(target: HTMLElement,
                             stream: Observable<Element>,
                             allExtenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>,
                             parser: (s: string) => Array<ElementTemplate | ModelToString | Slot>): void {
  let extenders: ExtenderDescriptor[] = [];
  let components: ComponentDescriptor[] = [];
  allExtenders.forEach(e => {
    if (isHtmlComponentDescriptor(e)) {
      const children: Array<ElementTemplate | ModelToString | Slot> = parser(e.children);
      components.push({
        name: e.name,
        init: e.init,
        children
      });
    } else {
      extenders.push(e);
    }
  });
  let patch: Patch;
  const renderer = (target: HTMLElement | VNode, stream: Observable<VNode>) => {
    if (patch) {
      //when using `renderer` patch will always exist, since we start the rendering with the last call of this(HTMLRenderer) function.
      //it's needed because the separate rendering of elements connected to other streams, this is handled by snabbdom and we want it to be handled by the same renderer.
      snabbdomRenderer(patch, target, stream);
    }
  };
  patch = init([
    eventModule.default,
    attributesModule.default,
    extendedModule(renderer)
  ]);
  const elementToVNode: (element: Element) => VNode = createElementToVNode(extenders, components);

  /*

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
      */
  const contentStream = stream.pipe(map(elementToVNode));
  renderer(target, contentStream);
}
