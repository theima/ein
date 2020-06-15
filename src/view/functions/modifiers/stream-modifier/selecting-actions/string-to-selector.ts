import { Selector } from '../../../../types-and-interfaces/select-action/selector';

export function stringToSelector(select: string): Selector {
  const nameRegex = /^[-a-z0-9_]+/i;
  const idRegex = /#([-a-z0-9_]+)/i;
  const classRegex = /\.([-a-z0-9_]+)/gi;
  let name: string | undefined;
  let id: string | undefined;
  let classes: string [] = [];
  let match = nameRegex.exec(select);
  if (match) {
    name = match[0];
  }
  match = idRegex.exec(select);
  if (match) {
    id = match[1];
  }
  match = classRegex.exec(select);
  while(match) {
    classes.push(match[1]);
    match = classRegex.exec(select);
  }
  return {
    name,
    id,
    classes
  };
}
