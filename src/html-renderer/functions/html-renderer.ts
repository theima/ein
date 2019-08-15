import { Observable } from 'rxjs';
import { Element, ElementTemplate } from '../../view';
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

export function HTMLRenderer(target: HTMLElement,
                             stream: Observable<Element>,
                             allExtenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>,
                             parser: (s: string) => Array<ElementTemplate | ModelToString | Slot>): void {
  const extenders: ExtenderDescriptor[] = [];
  const components: ComponentDescriptor[] = [];
  allExtenders.forEach(e => {
    if (isHtmlComponentDescriptor(e)) {
      components.push({ ...e, children: parser(e.children) });
    } else {
      extenders.push(e);
    }
  });
  let patch: Patch;
  const renderer = (target: HTMLElement | VNode, stream: Observable<VNode>) => {
    if (patch) {
      //when actually using the renderer patch will always exist, since we start the rendering with the last call of this function.
      snabbdomRenderer(patch, target, stream);
    }
  };
  patch = init([
    eventModule.default,
    attributesModule.default,
    extendedModule(renderer),
    extenderModule(extenders),
    componentModule(components)
  ]);
  const toVNode: (element: Element) => VNode = createElementToVNode(patch);
  const contentStream = stream.pipe(map(toVNode));
  renderer(target, contentStream);
}
