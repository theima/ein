import { NodeAsync } from '../../node-async';
import { ModelToElementOrNull } from '../types-and-interfaces/model-to-element-or-null';
import { getArrayElement } from '../../core/functions/get-array-element';
import { BuiltIn } from '../../html-template/types-and-interfaces/built-in';
import { Element } from '../types-and-interfaces/element';
import { ModelToElement } from '..';

export function conditionalModifier(
  createMap: () => ModelToElement,
  getNode: () => NodeAsync<object>,
  prev: ModelToElement): ModelToElementOrNull {
  const originalNode = getNode();
  let showing: boolean = false;
  let templateMap: ModelToElement = prev;
  let nodeForTemplate: NodeAsync<any> = originalNode;
  const map = (m: object) => {
    const element: Element = templateMap(m);
    const wasShowing = showing;
    const attr = getArrayElement('name', element.attributes, BuiltIn.If);
    const shouldShow = attr ? !!attr.value : false;
    showing = shouldShow;
    if (shouldShow) {
      if (!wasShowing) {
        templateMap = createMap();
        nodeForTemplate = getNode();
      }
      return templateMap(m);
    } else if (wasShowing && originalNode !== nodeForTemplate) {
      //Todo: this will not dispose the first node...
      nodeForTemplate.dispose();
    }
    return null;
  };
  return map as any;

}
