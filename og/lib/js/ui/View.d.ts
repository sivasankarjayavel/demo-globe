import { EventsHandler } from '../Events';
export interface IViewParams {
    model?: any;
    template?: string;
    parent?: View<any> | null;
    classList?: string[];
}
export type ViewEventsList = ["render"];
declare class View<M> {
    static __counter__: number;
    protected __id: number;
    events: EventsHandler<ViewEventsList>;
    model: M;
    template: string;
    parent: View<any> | null;
    el: HTMLElement | null;
    protected _classList: string[];
    constructor(options?: IViewParams);
    static getHTML(template: string, params: any): string;
    static parseHTML(htmlStr: string): HTMLElement[];
    static insertAfter(newNodes: HTMLElement | HTMLElement[], referenceNode: Node): HTMLElement[];
    static insertBefore(newNodes: HTMLElement | HTMLElement[], referenceNode: Node): HTMLElement[];
    insertBefore(view: View<any> | HTMLElement): void;
    insertAfter(view: View<any> | HTMLElement): void;
    isEqual(view: View<any>): boolean;
    appendTo(node: HTMLElement, clean?: boolean, firstPosition?: boolean): this;
    afterRender(parentNode: HTMLElement): void;
    beforeRender(parentNode: HTMLElement): void;
    stopPropagation(): void;
    renderTemplate(params: any): HTMLElement;
    render(params?: any): this;
    select<T extends HTMLElement>(queryStr: string): T | null;
    selectRemove(queryStr: string): HTMLElement | undefined;
    selectAll(queryStr: string, callback?: Function): NodeListOf<Element> | undefined;
    remove(): void;
}
export { View };
