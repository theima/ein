import { Dict } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { State } from '../../types-and-interfaces/state';
import { Title } from '../../types-and-interfaces/title';
import { TitleConfig } from '../../types-and-interfaces/title.config';

export function stateToTitle(titles: Dict<TitleConfig>, state: State): Title {
  const getTitle: (name: string) => string | Title = partial(propertyFromDict as any, titles, 'title' as any, '');
  const title: string | Title = getTitle(state.name);
  if (typeof title === 'string') {
    return (m: State) => title || '';
  }
  return title;
}
