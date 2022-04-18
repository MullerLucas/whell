import {HellElement} from "../hell_element.js";
import {HELL_EID_CHANGE_PAGE} from "../hell_defines.js";
import {IHellBaseStore} from "./hell_base_data.js";
import {HelLHtml} from "../hell_html.js";



export interface IHellPage {
    path: string;
    component: string;
    title: string;
}



export class HellRouter extends HellElement {
    private static _instance: HellRouter;

    protected _pages: any = {}
    protected _default_page: IHellPage = {} as IHellPage;
    protected _store: IHellBaseStore = {} as IHellBaseStore;



    // ============================================================================================
    // init
    // ============================================================================================

    constructor() {
        super();
        HellRouter._instance = this;
    }

    protected override on_connected() {
        this._store.act_set_curr_page(this.get_page_from_window_location());

        const state = this._store.get_state();
        this.render_page(state.curr_page);

        // called when user navigates in navigation-history
        window.addEventListener("popstate", this.on_popstate.bind(this));


        this.sroot.appendChild(
            HelLHtml.create_template_with_html(`
                <style> :host { min-height: 50vh; } </style>
            `)
                .content.cloneNode(true));
    }

    private on_popstate(event: PopStateEvent): void {
        const page = event.state;

        this._store.act_set_curr_page(
            page ? page : this._default_page
        );

        this.render_page(page);
    }



    // ============================================================================================
    // routing
    // ============================================================================================

    public static route_to_page(page: IHellPage): any {
        this._instance.go_to_page(page);
    }

    public static route_to_path(path: string): any {
        this._instance.go_to_path(path);
    }

    public go_to_page(page: IHellPage): void {
        HellRouter.add_page_to_history(page);
        this.render_page(page);
        this._store.act_set_curr_page(page);
    }

    public go_to_path(path: string): void {
        this.go_to_page(
            this.get_page_from_path(path)
        );
    }

    private static add_page_to_history(page: IHellPage): void {
        history.pushState(
            page,
            page.title,
            window.location.origin + page.path
        );
    }

    private render_path(path: string): void {
        this.render_page(
            this.get_page_from_path(path)
        );
    }

    private render_page(page: IHellPage): void {
        const element_id = "hell_route_container";
        const prev_page = this.sroot.getElementById(element_id);

        if (prev_page) {
            this.sroot.removeChild(prev_page);
        }

        const new_page = document.createElement(page.component);
        new_page.id = element_id;

        // new CustomEvent(HELL_EID_CHANGE_PAGE, { detail: page_id })
        new_page.addEventListener(HELL_EID_CHANGE_PAGE, (e: Event) => this.go_to_path((e as CustomEvent).detail));

        this.sroot.appendChild(new_page);

        document.title = page.title;
    }



    // ============================================================================================
    // utils
    // ============================================================================================

    private get_page_from_window_location(): IHellPage {
        return this.get_page_from_path(window.location.pathname);
    }

    private get_page_from_path(path: string): IHellPage {
        for (const curr in this._pages) {
            const curr_page: IHellPage = this._pages[curr];

            if (curr_page.path === path) {
                return curr_page;
            }
        }

        return this._default_page;
    }
}
