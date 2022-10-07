export interface IAddAttributeOpt {
    attr: string,
    val: string
}

export interface IAddEventHandlersOpt {
    click: any,
}

export interface ICreateElementOpt {
    id?: string,
    classes?: string[],
    attributes?: IAddAttributeOpt[],
    events?: IAddEventHandlersOpt
}



export class HelLHtml {

    // ============================================================================================
    // element modification
    // ============================================================================================

    public static html_add_id(element: HTMLElement, id: string) {
        element.id = id;
    }

    public static add_classes(element: HTMLElement, classes: string[]) {
        classes.forEach(value => element.classList.add(value));
    }

    public static add_attributes(element: HTMLElement, opt: IAddAttributeOpt[]) {
        opt.forEach(value => element.setAttribute(value.attr, value.val));
    }

    public static add_events(element: HTMLElement, opt: IAddEventHandlersOpt): void {
        Object.entries(opt).forEach(value => {
            element.addEventListener(value[0], value[1]);
        });
    }

    public static add_html(element: HTMLElement, html: string) {
        element.innerHTML = html;
    }



    // ============================================================================================
    // element creation
    // ============================================================================================

    public static create_element(tag: string, opt?: ICreateElementOpt): HTMLElement {
        const element = document.createElement(tag);

        if (!opt) { return element;}

        if (opt.id)      { HelLHtml.html_add_id(element, opt.id); }
        if (opt.classes) { HelLHtml.add_classes(element, opt.classes); }
        if (opt.attributes)    { HelLHtml.add_attributes(element, opt.attributes); }
        if (opt.events)  { HelLHtml.add_events(element, opt.events); }

        return element;
    }

    public static create_template_with_html(html: string): HTMLTemplateElement {
        const element = document.createElement("template");
        element.innerHTML = html;
        return element;
    }



    // ============================================================================================
    // querying
    // ============================================================================================

    public static query<E extends Element>(target: any, selector: string): E {
        // @ts-ignore
        const res = target.querySelector<E>(selector)!;
        if (!res) { throw `failed to query selector '${selector}' on element ${target}`; }
        return res;
    }

    public static query_all<E extends Element>(target: any, selector: string): NodeListOf<E> {
        // @ts-ignore
        const res = target.querySelectorAll<E>(selector);
        if (!res) { throw `failed to query-all selector '${selector}' on element ${target}`; }
        return res;
    }
}
