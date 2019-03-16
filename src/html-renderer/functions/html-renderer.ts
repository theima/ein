import { Observable } from 'rxjs';
import { Element } from '../../view';
import { snabbdomRenderer } from './snabbdom-renderer';
import { VNode } from 'snabbdom/vnode';
import { createElementToVnode } from './create-element-to-v-node';
import { map } from 'rxjs/operators';
import { init } from 'snabbdom';
import * as eventModule from 'snabbdom/modules/eventlisteners';
import * as attributesModule from 'snabbdom/modules/attributes';
import { extenderModule } from '../snabbdom-modules/extender.module';
import { ExtenderDescriptor } from '../types-and-interfaces/extender.descriptor';

export function HTMLRenderer(target: HTMLElement, stream: Observable<Element>, extenders: ExtenderDescriptor[]): void {
  const patch = init([
    eventModule.default,
    attributesModule.default,
    extenderModule(extenders)
  ]);
  const toVnode: (element: Element) => VNode = createElementToVnode(patch);
  snabbdomRenderer(patch, target, stream.pipe(map(toVnode)));
}
