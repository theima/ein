import { HtmlElementData } from '../types-and-interfaces/html-element-data';
import { Select } from '../../view/types-and-interfaces/select';

export function view(name: string,
                     template: string,
                     events?: Select): HtmlElementData {
  const result: HtmlElementData = {
    name,
    content: template
  };
  if (events) {
    result.events = events;
  }
  return result;
}
