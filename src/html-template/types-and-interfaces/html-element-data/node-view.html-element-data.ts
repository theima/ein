import { ActionMap, ActionMaps } from "../../../core";
import { ViewHtmlElementData } from "./view.html-element-data";

export interface NodeViewHtmlElementData extends ViewHtmlElementData {
  actionMapOrActionMaps: ActionMap<any> | ActionMaps<any>;
}
