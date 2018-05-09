import { makeMap } from '../functions/make-map';

export const HTMLElements = {
  // Empty Elements - HTML 4.01
  empty: makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed'),

// Block Elements - HTML 4.01
  block: makeMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul'),

// Inline Elements - HTML 4.01
  inline: makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var'),

// Elements that you can, intentionally, leave open
// (and which close themselves)
  closeSelf: makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'),

// Attributes that have their values filled in disabled="disabled"
  fillAttrs: makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected'),

// Special Elements (can contain anything)
  special: makeMap('script,style')

};
