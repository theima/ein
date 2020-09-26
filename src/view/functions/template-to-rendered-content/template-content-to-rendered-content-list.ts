import { partial } from '../../../core';
import { ElementTemplateContent } from '../../types-and-interfaces/element-template/element-template-content';
import { DynamicContent } from '../../types-and-interfaces/to-rendered-content/dynamic-content';
import { TemplateContentToRenderedContent } from '../../types-and-interfaces/to-rendered-content/template-content-to-rendered-content';
import { ViewScope } from '../../types-and-interfaces/to-rendered-content/view-scope';

export function templateContentToRenderedContentList(toContent: TemplateContentToRenderedContent,
                                                     scope: ViewScope,
                                                     content: ElementTemplateContent[]): DynamicContent[] {
  return content.map(partial(toContent, scope));
}
