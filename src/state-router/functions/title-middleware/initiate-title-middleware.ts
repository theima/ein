import { Dict, Middleware, partial } from '../../../core';
import { propertyFromDict } from '../../../core/functions/dict/property-from-dict';
import { TitleStateDescriptor } from '../../types-and-interfaces/config/descriptor/title.state-descriptor';
import { Title } from '../../types-and-interfaces/config/title';
import { createSetTitle } from './create-set-title';
import { stateToTitle } from './state-to-title';
import { titleMiddleware } from './title.middleware';

export function initiateTitleMiddleware(paths: Dict<TitleStateDescriptor>): Middleware {
  const getTitle: (name: string) => string | Title = partial(propertyFromDict, paths, 'title' as any, '');
  return partial(titleMiddleware, partial(stateToTitle, getTitle), createSetTitle(document));
}
