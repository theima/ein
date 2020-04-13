import { History } from 'history';

export function createPushUrl(history: History, getId: () => number): (url: string) => void {
  return (url: string) => {
    history.push(url, getId());
  };
}
