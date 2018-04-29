import { History } from 'history';
import { history } from '../history';

export const pushPath: (path: string) => void = ((history: History) => {
  return (path: string) => {
    if (history.location.pathname !== path) {
      history.push(path);
    }
  };
})(history);
