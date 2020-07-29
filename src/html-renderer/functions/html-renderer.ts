import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { init } from 'snabbdom';
import * as attributesModule from 'snabbdom/modules/attributes';
import * as eventModule from 'snabbdom/modules/eventlisteners';
import { VNode } from 'snabbdom/vnode';
import { ModelToString } from '../../core/types-and-interfaces/model-to-string';
import { Element, ElementTemplate } from '../../view';
import { extendedModule } from '../snabbdom-modules/extended.module';
import { ComponentDescriptor } from '../types-and-interfaces/component.descriptor';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';
import { HTMLComponentDescriptor } from '../types-and-interfaces/html-component.descriptor';
import { Patch } from '../types-and-interfaces/patch';
import { elementToVNode } from './element-to-v-node';
import { snabbdomRenderer } from './snabbdom-renderer';
import { isHtmlComponentDescriptor } from './type-guards/is-html-component-descriptor';

export function HTMLRenderer(target: HTMLElement,
                             stream: Observable<Element>,
                             allExtenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>,
                             parser: (s: string) => Array<ElementTemplate | ModelToString | string>): void {
  let extenders: ExtenderDescriptor[] = [];
  let components: ComponentDescriptor[] = [];
  allExtenders.forEach((e) => {
    if (isHtmlComponentDescriptor(e)) {
      const children: Array<ElementTemplate | ModelToString | string> = parser(e.children);
      components.push({
        name: e.name,
        init: e.init,
        children
      });
    } else {
      extenders.push(e);
    }
  });
  let patch!: Patch;
  const renderer = (target: HTMLElement | VNode, stream: Observable<VNode>, isContentUpdate: boolean = false) => {
    // when using `renderer` patch will always exist, since we start the rendering with the last call of this (HTMLRenderer) function.
    // it's needed because the separate rendering of elements connected to other streams, this is handled by snabbdom and we want it to be handled by the same renderer.
    return snabbdomRenderer(patch, target, stream, isContentUpdate);
  };
  patch = init([
    eventModule.default,
    attributesModule.default,
    extendedModule(components, extenders, renderer)
  ]);
  const contentStream = stream.pipe(map(elementToVNode));
  renderer(target, contentStream);
}
