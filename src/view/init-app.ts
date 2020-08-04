
import { map } from 'rxjs/operators';
import { arrayToDict, get, partial, Value } from '../core';
import { lowerCasePropertyValue } from '../core/functions/lower-case-property-value';
import { ValueMapDescriptor } from '../html-parser';
import { htmlStringToElementTemplateContent } from '../html-parser/functions/html-string-to-element-template-content';
import { HtmlViewTemplate } from '../html-parser/types-and-interfaces/html.view-template';
import { HTMLRenderer } from '../html-renderer/functions/html-renderer';
import { ExtenderDescriptor } from '../html-renderer/types-and-interfaces/extender.descriptor';
import { HTMLComponentDescriptor } from '../html-renderer/types-and-interfaces/html-component.descriptor';
import { NodeAsync } from '../node-async';
import { eGroup } from './elements/e-group';
import { createElementTemplateToDynamicNode } from './functions/create-element-template-to-dynamic-node';
import { rootElementMap } from './functions/element-map/root-element.map';
import { nodeModifier } from './functions/new-modifiers/node.modifier';
import { renderer } from './functions/renderer';
import { isCustomElementTemplateDescriptor } from './functions/type-guards/is-custom-element-template-descriptor';
import { BuiltIn } from './types-and-interfaces/built-in';
import { NewModifier } from './types-and-interfaces/new-modifier';
import { CustomViewTemplate } from './types-and-interfaces/view-templates/custom.view-template';
import { ViewTemplate } from './types-and-interfaces/view-templates/view-template';

export function initApp(target: string,
                        node: NodeAsync<Value>,
                        viewName: string,
                        elements: Array<CustomViewTemplate | ViewTemplate>,
                        maps: ValueMapDescriptor[],
                        extenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>): void {
  const e = document.getElementById(target);

  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const htmlParser = htmlStringToElementTemplateContent(maps);
  const htmlMap = (descriptor: HtmlViewTemplate) => {
    return { ...descriptor, children: htmlParser(descriptor.children) };
  };
  const views: ViewTemplate[] = elements.map((e) => {
    if (isCustomElementTemplateDescriptor(e)) {
      return htmlMap(e);
    }
    return e;
  }).map(lowerCaseName) as any;
  const viewDict = arrayToDict('name', views);
  const getViewTemplate: (name: string) => ViewTemplate | undefined = (name: string) => {
    if (name === BuiltIn.Group) {
      return eGroup;
    }
    return get(viewDict, name.toLowerCase());
  };

  const useOld = e?.hasAttribute('old');
  if (useOld) {
    const elementMap = rootElementMap(getViewTemplate, viewName, node);
    if (e) {
      const stream = (node as any).pipe(map(elementMap));
      HTMLRenderer(e, stream, extenders, htmlParser);
    }
  } else {
    let mainViewTemplate: ViewTemplate | undefined = getViewTemplate(viewName);
    if (!mainViewTemplate) {
      // throwing for now
      throw new Error('could not find view for root');
    }

    if (!mainViewTemplate.properties.find((p) => p.name === BuiltIn.ConnectActionsToNode)) {
      throw new Error('root must be a node view');
    }
    if (e) {
      const modifiers: NewModifier[] = [nodeModifier];
      renderer(e, viewName, createElementTemplateToDynamicNode(modifiers, getViewTemplate), node);
    } else {
      throw new Error('no element for app to replace');
    }
  }
}
