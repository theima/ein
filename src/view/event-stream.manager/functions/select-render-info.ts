import { RenderInfo } from '../../types-and-interfaces/render-info';
import { Selector } from '../interfaces/selector';
import { getProperty } from '../../functions/get-property';

export function selectRenderInfo(infos: RenderInfo[], selector: Selector): RenderInfo[] {
  return infos.filter(
    (info) => {
      if (!selector.name && !selector.id && !selector.classes.length) {
        return false;
      }
      if (selector.name) {
        if (selector.name !== info.name) {
          return false;
        }
      }
      if (selector.id) {
        const id = getProperty(info, 'id');
        if (!id || id.value !== selector.id) {
          return false;
        }
      }
      let classes: string[] = [];
      const classProperty = getProperty(info, 'class');
      if (classProperty) {
        const val = classProperty.value + '';
        classes = val.split(' ');
      }
      return selector.classes.reduce(
        (all, selectorClass) => all && classes.indexOf(selectorClass) !== -1, true);
    }
  );
}
