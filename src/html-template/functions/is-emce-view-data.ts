import { EmceViewData, ViewData } from '..';

export function isEmceViewData(viewData: ViewData | EmceViewData | null | undefined): viewData is EmceViewData {
  if (!viewData) {
    return false;
  }
  return !!(viewData as EmceViewData).createChildFrom;
}
