import { Observable } from 'rxjs/Observable';

export interface SubStreamSubscribe {
  type: string;
  stream: Observable<any>;
  subscription: {
    unsubscribe(): void;
  };
}
