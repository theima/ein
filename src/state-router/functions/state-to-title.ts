import { Dict } from '../types-and-interfaces/dict';
import { TitleConfig } from '../types-and-interfaces/title.config';
import { propertyFromDict } from './property-from-dict';
import { Title } from '../types-and-interfaces/title';
import { State } from '../types-and-interfaces/state';

export function stateToTitle(titles: Dict<TitleConfig>): (state: State) => Title {
  const getTitle: (name: string) => string | Title = propertyFromDict(titles, 'title' as any, '');
  return (state: State) => {
    const title: string | Title = getTitle(state.name);
    if (typeof title === 'string') {
      return (m: State) => title || '';
    }
    return title;
  };
}
