export interface TemplateElement {
    tag: string;
    children: Array<TemplateElement | string>;
}
