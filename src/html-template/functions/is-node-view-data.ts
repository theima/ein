import { NodeViewData, ViewData } from '..';

export function isNodeViewData(viewData: ViewData | NodeViewData | null | undefined): viewData is NodeViewData {
  if (!viewData) {
    return false;
  }
  return !!(viewData as NodeViewData).createChildFrom;
}
