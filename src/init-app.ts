import {patch} from './patch';
import {Emce} from 'emce';
import {VNode} from 'snabbdom/vnode';
import {toSnabbdomNode} from './functions/to-snabbdom-node';
import {createElementFromTemplate} from './functions/create-element-from-template';
import {TemplateElement} from './template-element';

export function initApp(target: string, emce: Emce<any>, elm: TemplateElement): void {
  let dict: any = {};
  let getter = (key: string) => {
    if (dict[key]) {
      return dict[key];
    }
    return null;
  };
  let elementFromTemplate = createElementFromTemplate(getter);
  dict.view = elementFromTemplate({
    tag: 'view',
    children: ['viewer {{value}}']
  });

  function initer() {
    let container: any = document.getElementById(target);
    let mapper = elementFromTemplate(elm);
    emce.subscribe(m => {
      container = patch(container, toSnabbdomNode(mapper(m)) as VNode);
    });
  }

  initer();
}
