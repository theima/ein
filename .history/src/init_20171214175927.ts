import {h} from 'snabbdom';
import { patch } from './patch';

export function init(target: string): void {
  function view(currentDate: any) { 
    return h('div', 'Current date ' + currentDate); 
  }
  function initApp() {
    var oldVnode = document.getElementById('target');
    var count = 0;
    setInterval( () => {
      let newVnode = view(new Date());
      if (count > 10) {
          newVnode = oldVnode as any;
      }
      count++;
      oldVnode = patch(oldVnode, newVnode);
    }, 1000);
  }
  initApp();
}
