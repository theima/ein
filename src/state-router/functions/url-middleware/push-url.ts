import { History } from 'history';
import { history } from './path-changes/history';

export const pushUrl: (url: string) => void = ((history: History) => {
  return (url: string) => {
    history.push(url);
  };
})(history);
