import { Selector } from '../types-and-interfaces/selector';

export function createSelector(select: string): Selector {
  const nameRegex = /^[-a-z0-9_]+/i;
  const idRegex = /#([-a-z0-9_]+)/i;
  const classRegex = /\.([-a-z0-9_]+)/gi;
  let name: string | null = null;
  let id: string | null = null;
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