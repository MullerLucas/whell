interface IHellResource {
    path: string,
    is_blocking: boolean
}

export class HellElement extends HTMLElement {
    protected sroot: ShadowRoot;



    // ============================================================================================
    // init
    // ============================================================================================

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        if (!this.shadowRoot) { console.error("failed to construct hell-element: shadow-root is null!"); }

        // @ts-ignore
        this.sroot = this.shadowRoot;
    }

    connectedCallback() { this.on_connected(); }
    disconnectedCallback() { this.on_disconnected(); }

    protected on_connected(): void { }
    protected on_disconnected(): void { }



    // ============================================================================================
    // view
    // ============================================================================================

    public trigger_view_update = () => { this.update_view(); };
    protected update_view(): void { }



    // ============================================================================================
    // utils
    // ============================================================================================

    public query_sroot(selectors: string): Element {
        const element = this.sroot.querySelector(selectors);

        if (!element) { console.error(`query_safe failed with selectors '${selectors}'`); }

        // @ts-ignore
        return element;
    }

}
