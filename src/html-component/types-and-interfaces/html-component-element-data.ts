import { Select } from '../../view/types-and-interfaces/select';
import { ViewEvent } from '../../view';
import { Observable } from 'rxjs/internal/Observable';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';

export interface HtmlComponentElementData<T> {
  name: string;
  content: string;
  events?: (select: Select) => Observable<ViewEvent>;
  setElementLookup: SetNativeElementLookup<T>;
}
