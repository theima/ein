import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Value } from '../../../core';
import { NodeAsync } from '../../../node-async';
import { BuiltIn } from '../../types-and-interfaces/built-in';
import { Element } from '../../types-and-interfaces/elements/element';
import { LiveElement } from '../../types-and-interfaces/elements/live.element';
import { ModelToElementOrNull } from '../../types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../types-and-interfaces/elements/model-to-elements';
import { StaticElement } from '../../types-and-interfaces/elements/static.element';
import { FilledElementTemplate } from '../../types-and-interfaces/templates/filled.element-template';
import { getProperty } from '../get-property';

export function connectNodeModifier(viewId: string) {
  const toContentMap = (element: StaticElement) => element.content;
  return (next: (node: NodeAsync<Value>, template: FilledElementTemplate) => ModelToElements | ModelToElementOrNull) => {
    return (node: NodeAsync<Value>, template: FilledElementTemplate) => {
      const connectProperty = getProperty(BuiltIn.ConnectToNodeStream, template);
      if (connectProperty) {
        const result = next(node, template);
        const elementMap = (m: any) => {
          return result(m, m) as any;
        };
        const nodeStream: Observable<any> = node as any;
        const updates = new ReplaySubject<Element>(1);
        const subscription = nodeStream.subscribe(
          (m) => {
            updates.next(m);
          }, (e) => {
            updates.error(e);
          },
          () => {
            updates.complete();
          });

        const contentStream = updates.pipe(map(elementMap), map(toContentMap));
        const willBeDestroyed = () => {
          subscription.unsubscribe();
          updates.complete();
        };
        const element: LiveElement = {
          name: template.name,
          id: viewId,
          properties: [],
          contentStream,
          willBeDestroyed
        };
        return (m: Value, im: Value) => {
          return element;
        };
      }
      return next(node, template);
    };
  };

}
