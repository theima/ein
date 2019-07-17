import { rootElementMap } from './functions/element-map/root-element.map';
import { NodeAsync } from '../node-async';
import { map } from 'rxjs/operators';
import { createHtmlMap } from '../html-parser/functions/create-html-map';
import { ValueMapDescriptor } from '../html-parser';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { BuiltIn } from './types-and-interfaces/built-in';
import { eGroup } from './elements/e-group';
import { ExtenderDescriptor } from '../html-renderer/types-and-interfaces/extender.descriptor';
import { ElementTemplateDescriptor } from './types-and-interfaces/descriptors/element-template-descriptor';
import { get, arrayToDict, partial, Value } from '../core';
import { lowerCasePropertyValue } from '../core/functions/lower-case-property-value';
import { CustomElementDescriptor } from './types-and-interfaces/descriptors/custom.element-template-descriptor';
import { isCustomElementTemplateDescriptor } from './functions/type-guards/is-custom-element-template-descriptor';
import { ComponentDescriptor } from '../html-renderer/types-and-interfaces/component.descriptor';

export function initApp(target: string,
                        node: NodeAsync<object>,
                        viewName: string,
                        elements: Array<CustomElementDescriptor | ElementTemplateDescriptor>,
                        maps: ValueMapDescriptor[],
                        extenders: Array<ExtenderDescriptor | ComponentDescriptor>): void {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const htmlMap = createHtmlMap(maps);
  const views: ElementTemplateDescriptor[] = elements.map(e=> {
    if (isCustomElementTemplateDescriptor(e)) {
      return htmlMap(e);
    }
    return e;
  }).map(lowerCaseName) as any;
  const viewDict = arrayToDict('name', views);
  const getDescriptor: (name: string) => ElementTemplateDescriptor | null = (name: string) => {
    return get(viewDict, name.toLowerCase());
  };
  const getDefaultDescriptor = (name: string) => {
    if (name === BuiltIn.Group) {
      return eGroup;
    }
    return null;
  };
  const getElement = (name: string) => {
    return getDefaultDescriptor(name) || getDescriptor(name);
  };
  const elementMap = rootElementMap(getElement, viewName, node);
  const e = document.getElementById(target);
  const viewMap = (m: Value) => {
    return elementMap(m, m);
  };
  if (e) {
    HTMLRenderer(e, (node as any).pipe(map(viewMap)), extenders);
  }
}
