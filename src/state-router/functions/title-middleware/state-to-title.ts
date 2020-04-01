import { Dict } from '../../../core';
import { partial } from '../../../core/functions/partial';
import { propertyFromDict } from '../../../core/functions/property-from-dict';
import { TitleStateDescriptor } from '../../types-and-interfaces/config/descriptor/title.state-descriptor';
import { Title } from '../../types-and-interfaces/config/title';
import { State } from '../../types-and-interfaces/state/state';

export function stateToTitle(titles: Dict<TitleStateDescriptor>, state: State): string {
  const getTitle: (name: string) => string | Title = partial(propertyFromDict as any, titles, 'title' as any, '');
  const title: string | Title = getTitle(state.name);
  if (typeof title === 'string') {
    return title;
  }
  return title(state);
}
