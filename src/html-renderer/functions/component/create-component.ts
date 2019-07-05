import { Select } from '../../../view';
import { Observable, ReplaySubject } from 'rxjs';
import { Action, arrayToDict, Dict, Value } from '../../../core';
import { ModelToString } from '../../../core/types-and-interfaces/model-to-string';
import { mapContent } from '../../../view/functions/element-map/map-content';
import { ModelToElementOrNull } from '../../../view/types-and-interfaces/elements/model-to-element-or-null';
import { ModelToElements } from '../../../view/types-and-interfaces/elements/model-to-elements';
import { map } from 'rxjs/operators';
import { Property } from '../../../view/types-and-interfaces/property';
import { FilledSlot } from '../../../view/types-and-interfaces/slots/filled.slot';
import { MappedSlot } from '../../../view/types-and-interfaces/slots/mapped.slot';
import { InitiateComponent } from '../../types-and-interfaces/initiate-component';
import { CreateComponentResult } from '../../types-and-interfaces/create-component-result';
import { FilledElementTemplate } from '../../../view/types-and-interfaces/templates/filled.element-template';

export function createComponent(initiateComponent: InitiateComponent,
                                id: string,
                                content: Array<FilledElementTemplate | ModelToString | FilledSlot>,
                                createMaps: (elements: Array<FilledElementTemplate | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                                select: Select,
                                element: Element): CreateComponentResult {
  let lastProperties: Property[] = [];
  let lastModel: Value = {};
  const updateChildren = (properties: Property[], model: Value) => {
    lastProperties = properties;
    lastModel = model;
    const attrDict = arrayToDict(a => a.value, 'name', properties);
    propertyStream.next({ properties: attrDict as any, model });
  };
  let propertyStream: ReplaySubject<{ properties: Dict<string | number | boolean>; model: Value }> = new ReplaySubject<{ properties: Dict<string | number | boolean>; model: Value }>(1);

  const update = () => {
    updateChildren(lastProperties, lastModel);
  };
  const c = initiateComponent(element, select, update);
  let propertyMap: (properties: Dict<string | number | boolean>) => Dict<string | number | boolean> = a => a;
  propertyMap = c.map || propertyMap;
  const actionStream = c.actions || new Observable<Action>();
  const contentMaps = createMaps(content);// todo: slot must be handled.
  const completeStream = () => {
    if (propertyStream) {
      propertyStream.complete();
    }
  };
  const onDestroy = () => {
    if (c.onBeforeDestroy) {
      c.onBeforeDestroy();
    }
    completeStream();
  };
  const stream = propertyStream.pipe(
    map(
      (value => {
        let properties = value.properties;
        if (propertyMap) {
          properties = propertyMap(properties);
        }
        return mapContent(id, contentMaps, properties, value.model);
      })
    )
  );
  return {
    stream,
    updateChildren,
    onDestroy,
    actionStream
  };
}
