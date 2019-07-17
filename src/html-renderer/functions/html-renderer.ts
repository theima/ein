import { Observable } from 'rxjs';
import { Element } from '../../view';
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
import { isComponentDescriptor } from './type-guards/is-component-descriptor';
import { componentModule } from '../snabbdom-modules/component.module';

export function HTMLRenderer(target: HTMLElement, stream: Observable<Element>, allExtenders: Array<ExtenderDescriptor | ComponentDescriptor>): void {
  const extenders: ExtenderDescriptor[] = [];
  const components: ComponentDescriptor[] = [];
  allExtenders.forEach(e => {
    if (isComponentDescriptor(e)) {
      components.push(e);
    } else {
      extenders.push(e);
    }
  });
  const patch = init([
    eventModule.default,
    attributesModule.default,
    extendedModule,
    extenderModule(extenders),
    componentModule(components)
  ]);
  const toVNode: (element: Element) => VNode = createElementToVNode(patch);
  snabbdomRenderer(patch, target, stream.pipe(map(toVNode)));
}
