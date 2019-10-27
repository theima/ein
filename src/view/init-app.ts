import { map } from 'rxjs/operators';
import { arrayToDict, get, partial, Value } from '../core';
import { lowerCasePropertyValue } from '../core/functions/lower-case-property-value';
import { ValueMapDescriptor } from '../html-parser';
import { htmlStringToElementTemplateContent } from '../html-parser/functions/html-string-to-element-template-content';
import { HtmlElementTemplateDescriptor } from '../html-parser/types-and-interfaces/descriptors/html-element-template-descriptor';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { ExtenderDescriptor } from '../html-renderer/types-and-interfaces/extender.descriptor';
import { HTMLComponentDescriptor } from '../html-renderer/types-and-interfaces/html-component.descriptor';
import { NodeAsync } from '../node-async';
import { eGroup } from './elements/e-group';
import { rootElementMap } from './functions/element-map/root-element.map';
import { isCustomElementTemplateDescriptor } from './functions/type-guards/is-custom-element-template-descriptor';
import { BuiltIn } from './types-and-interfaces/built-in';
import { CustomElementDescriptor } from './types-and-interfaces/descriptors/custom.element-template-descriptor';
import { ElementTemplateDescriptor } from './types-and-interfaces/descriptors/element-template-descriptor';

export function initApp(target: string,
                        node: NodeAsync<object>,
                        viewName: string,
                        elements: Array<CustomElementDescriptor | ElementTemplateDescriptor>,
                        maps: ValueMapDescriptor[],
                        extenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>): void {
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const htmlParser = htmlStringToElementTemplateContent(maps);
  const htmlMap = (descriptor: HtmlElementTemplateDescriptor) => {
    return { ...descriptor, children: htmlParser(descriptor.children) };
  };
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
    const stream = (node as any).pipe(map(viewMap));
    HTMLRenderer(e, stream, extenders, htmlParser);
  }
}
