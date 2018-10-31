import { Select } from '../../view/types-and-interfaces/select';
import { ViewEvent } from '../../view';
import { Observable } from 'rxjs/internal/Observable';
import { SetNativeElementLookup } from '../../view/types-and-interfaces/set-native-element-lookup';
import { CreateComponentElement } from '../../view/types-and-interfaces/create-component-element';

export interface HtmlComponentElementData<T> {
  name: string;
  content: string;
  events?: (select: Select) => Observable<ViewEvent>;
  setElementLookup: SetNativeElementLookup<T>;
  setCreateElement: (create: CreateComponentElement) => void;
}
