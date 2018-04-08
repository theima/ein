
import { ModelToString } from '../types-and-interfaces/model-to-string';
import { RenderData } from '..';

export function getRenderData(content: Array<RenderData | ModelToString>): RenderData[] {
  return content.filter(
    (template: RenderData | ModelToString) => {
      return typeof template === 'object';
    }
  ) as RenderData[];
}
