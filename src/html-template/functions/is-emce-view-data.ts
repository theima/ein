import { EmceViewData, ViewData } from '..';

export function isEmceViewData(viewData: ViewData | EmceViewData): viewData is EmceViewData {
  return !!(viewData as EmceViewData).createChildFrom;
}
