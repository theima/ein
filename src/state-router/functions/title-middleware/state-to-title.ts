import { Title } from '../../types-and-interfaces/config/title';
import { State } from '../../types-and-interfaces/state/state';

export function stateToTitle(
  getTitle: (name: string) => string | Title,
  state: State
): string {
  const title: string | Title = getTitle(state.name);
  if (typeof title === 'string') {
    return title;
  }
  return title(state);
}
