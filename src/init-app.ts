import {h} from 'snabbdom';
import { patch } from './patch';
import { Emce } from 'emce';

export function initApp(target: string, emce: Emce<any>): void {
  function initer() {
    let oldVnode: any = document.getElementById(target);
    let count = 0;
    setInterval( () => {
      let newVnode = h('div', 'n:' + count);
      if (count > 10) {
          newVnode = oldVnode as any;
      }
      count++;
      oldVnode = patch(oldVnode, newVnode);
    }, 1000);
  }
  initer();
}
