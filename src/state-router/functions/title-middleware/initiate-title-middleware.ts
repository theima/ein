import { Dict, partial } from '../../../core';
import { TitleStateDescriptor } from '../../types-and-interfaces/config/descriptor/title.state-descriptor';
import { createSetTitle } from './create-set-title';
import { stateToTitle } from './state-to-title';
import { titleMiddleware } from './title.middleware';

export function initiateTitleMiddleware(paths: Dict<TitleStateDescriptor>) {
  return partial(titleMiddleware, partial(stateToTitle, paths), createSetTitle(document));
}
