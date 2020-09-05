
import { map } from 'rxjs/operators';
import { arrayToDict, fromDict, get, partial, Value } from '../core';
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
import { nodeViewElementBuilder } from './functions/element-builders/node-view.element-builder';
import { viewElementBuilder } from './functions/element-builders/view.element-builder';
import { rootElementMap } from './functions/element-map/root-element.map';
import { conditionalModifier } from './functions/new-modifiers/conditional.modifier';
import { listModifier } from './functions/new-modifiers/list.modifier';
import { listenModifier } from './functions/new-modifiers/listen.modifier';
import { modelModifier } from './functions/new-modifiers/model.modifier';
import { renderer } from './functions/renderer';
import { toRoot } from './functions/to-root';
import { isCustomElementTemplateDescriptor } from './functions/type-guards/is-custom-element-template-descriptor';
import { isNodeViewTemplate } from './functions/type-guards/is-node-view-template';
import { BuiltIn } from './types-and-interfaces/built-in';
import { ElementBuilder } from './types-and-interfaces/element-builder';
import { NewModifier } from './types-and-interfaces/new-modifier';
import { CustomViewTemplate } from './types-and-interfaces/view-templates/custom.view-template';
import { NodeViewTemplate } from './types-and-interfaces/view-templates/node-view-template';
import { ViewTemplate } from './types-and-interfaces/view-templates/view-template';

export function initApp(target: string,
                        node: NodeAsync<Value>,
                        viewName: string,
                        viewTemplates: Array<ViewTemplate | CustomViewTemplate>,
                        maps: ValueMapDescriptor[],
                        extenders: Array<ExtenderDescriptor | HTMLComponentDescriptor>): void {
  const e = document.getElementById(target);
  const lowerCaseName = partial(lowerCasePropertyValue as any, 'name');
  const htmlParser = htmlStringToElementTemplateContent(maps);
  const htmlMap = (descriptor: HtmlViewTemplate) => {
    return { ...descriptor, children: htmlParser(descriptor.children) };
  };
  const parsedViewTemplates: ViewTemplate[] = viewTemplates.map((e) => {
    if (isCustomElementTemplateDescriptor(e)) {
      return htmlMap(e);
    }
    return e;
  }).map(lowerCaseName) as any;
  const useOld = e?.hasAttribute('old');
  if (useOld) {

    const viewDict = arrayToDict('name', parsedViewTemplates);
    const getViewTemplate: (name: string) => ViewTemplate | undefined = (name: string) => {
      if (name === BuiltIn.Group) {
        return eGroup;
      }
      return get(viewDict, name.toLowerCase());
    };
    const elementMap = rootElementMap(getViewTemplate, viewName, node);
    if (e) {
      const stream = (node as any).pipe(map(elementMap));
      HTMLRenderer(e, stream, extenders, htmlParser);
    }
  } else {
    let nodeViews: NodeViewTemplate[] = [];
    let views: ViewTemplate[] = [];
    parsedViewTemplates.forEach((v) => {
      if (isNodeViewTemplate(v)) {
        nodeViews.push(v);
      } else {
        views.push(v);
      }

    });
    const viewDict = arrayToDict('name', views);
    const nodeViewDict = arrayToDict('name', nodeViews);
    if (!fromDict(nodeViewDict, viewName)) {
      // throwing for now
      throw new Error('could not find view for root, it must have a view and it needs to be a node view.');
    }
    if (e) {
      const elementBuilders: ElementBuilder[] = [
        partial(viewElementBuilder, partial(fromDict, viewDict)),
        partial(nodeViewElementBuilder, partial(fromDict, nodeViewDict))
      ];
      const modifiers: NewModifier[] = [conditionalModifier, listModifier, listenModifier, modelModifier];
      const templateToDynamicNode = createElementTemplateToDynamicNode(elementBuilders, modifiers);
      renderer(e, viewName, toRoot(templateToDynamicNode, node));
    } else {
      throw new Error('no element for app to replace');
    }
  }
}
