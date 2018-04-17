import { RenderInfo } from '../types-and-interfaces/render-info';

export function getRenderInfo(content: Array<RenderInfo | string>): RenderInfo[] {
  return content.filter(
    (template: RenderInfo | string) => {
      return typeof template === 'object';
    }
  ) as RenderInfo[];
}
