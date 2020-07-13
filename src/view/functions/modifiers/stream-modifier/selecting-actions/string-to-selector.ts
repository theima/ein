import { regex } from '../../../../types-and-interfaces/select-action/regex';
import { Selector } from '../../../../types-and-interfaces/select-action/selector';

export function stringToSelector(select: string): Selector {
  let classes: string [] = [];
  let match = regex.class.exec(select);
  while(match) {
    classes.push(match[1]);
    match = regex.class.exec(select);
  }
  let selector:Selector = {
    classes
  };
  match = regex.name.exec(select);
  if (match) {
    selector.name = match[0];
  }
  match = regex.id.exec(select);
  if (match) {
    selector.id = match[1];
  }
  return selector;
}
