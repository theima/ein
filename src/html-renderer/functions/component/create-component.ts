import { Select, ElementTemplate } from '../../../view';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { SetNativeElementLookup } from '../../types-and-interfaces/set-native-element-lookup';
import { NativeElementReferenceSelect } from '../../types-and-interfaces/native-element-reference-select';
import { Selector } from '../../../view/types-and-interfaces/selector';
import { createSelector } from '../../../view/functions/create-selector';
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

export function createComponent(initiateComponent: InitiateComponent,
                                id: string,
                                content: Array<ElementTemplate | ModelToString | FilledSlot>,
                                createMaps: (elements: Array<ElementTemplate | ModelToString | FilledSlot>) => Array<ModelToElementOrNull | ModelToString | ModelToElements | MappedSlot>,
                                select: Select) {
  let selects: NativeElementReferenceSelect[] = [];
  const nativeElementSelect = (selectorString: string) => {
    const selector = createSelector(selectorString);
    const added: Subject<Element[]> = new Subject<Element[]>();
    const removed: Subject<Element[]> = new Subject<Element[]>();
    const streams = {
      added,
      removed
    };
    const newSelect: NativeElementReferenceSelect = {
      selector,
      added,
      removed
    };
    selects = [...selects, newSelect];
    return streams;
  };

  let setElementLookup: SetNativeElementLookup = (lookup: (selector: Selector) => Element[]) => {
    const newSelects: NativeElementReferenceSelect[] = [];
    selects.forEach(
      (s: NativeElementReferenceSelect) => {
        const matches = lookup(s.selector);
        const last = s.last || [];
        newSelects.push({ ...s, last: matches });
        let newMatches = matches.filter(n => !last.includes(n));
        if (newMatches.length) {
          s.added.next(newMatches);
        }
        const oldMatches = last.filter(n => !matches.includes(n));
        if (oldMatches.length) {
          s.removed.next(oldMatches);
        }
      }
    );
    selects = newSelects;
  };
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
  const c = initiateComponent(select, nativeElementSelect, update);
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
      setElementLookup(() => []);
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
    actionStream,
    setElementLookup
  };
}
