

// ============================================================================================
// paths
// ============================================================================================

import {HellFetcher} from "./hell_fetcher.js";

export class HellPaths {
    public static readonly CSS_WHELL = "/lib/whell_common/styles/whell.css";
    public static readonly CSS_HELLOKI = "/lib/whell_common/styles/helloki.css";
    public static readonly CSS_PROJECT = "/styles/project.css";
    public static readonly CSS_DEFAULTS = [
        { path: HellPaths.CSS_WHELL },
        { path: HellPaths.CSS_HELLOKI },
        { path: HellPaths.CSS_PROJECT }
    ];

    public static readonly CSS_FA = "/assets/fontawesome/css/all.min.css";
}



// ============================================================================================
// handles
// ============================================================================================

export enum HellHtmlType {
    FromExtension,
    None,
    NoWrap,
    Style,
}

export interface HellImportDef {
    path: string
    html_type?: HellHtmlType;

}

export class HellImportHandle {
    def: HellImportDef

    text?: string;
    html?: HTMLTemplateElement;

    constructor(def: HellImportDef) {
        this.def = def;
    }
}



export class HellImporter {
    private static _handles: Map<string, Promise<HellImportHandle>> = new Map<string, Promise<HellImportHandle>>();


    // ============================================================================================
    // loading
    // ============================================================================================

    private static _create_new_promise_handle(def: HellImportDef): Promise<HellImportHandle> {
        return HellFetcher.to_text(HellFetcher.get(def.path)).then(text => {
            // create, freeze and return new handle
            return Object.freeze({
                def,
                text,
                html: HellImporter._add_html_content(text, def),
            } as HellImportHandle)
        })
    }

    public static start_loading_resources(defs: HellImportDef[]): Promise<HellImportHandle>[] {
        let promises: Promise<HellImportHandle>[] = [];

        defs.forEach(def => {

            // try to get existing handle
            let handle = HellImporter._handles.get(def.path);

            if (!handle) {
                // create new handle
                handle = HellImporter._create_new_promise_handle(def);
                HellImporter._handles.set(def.path, handle);
            }

            promises.push(handle);

        });

        return promises;
    }

    private static _add_html_content(text: string, def: HellImportDef): HTMLTemplateElement {
        const template = document.createElement("template");

        switch (HellImporter.get_actual_html_type(def)) {
            case HellHtmlType.Style:
                template.innerHTML = `<style>${text}</style>`
                break;
            default:
                template.innerHTML = text;
                break;
        }

        return template;
    }



    // ============================================================================================
    // wait for import
    // ============================================================================================

    // wait blocking
    // -------------
    public static async load_resources(...defs: Array<HellImportDef[]>): Promise<HellImportHandle[]> {
        let promises = [];

        for (const def of defs) {
            promises.push(...HellImporter.start_loading_resources(def));
        }

        let handles = [];

        for (const prom of promises) {
            handles.push(await prom);
        }

        return handles;
    }

    // wait non-blocking
    // -----------------
    public static call_when_loaded(promises: Promise<HellImportDef>[], on_res_loaded: (h: HellImportDef) => void): void {
        promises.forEach(prom => {
            prom.then(on_res_loaded);
        });
    }

    public static add_all_imports_to_node_when_loaded(node: Node, promises: Promise<HellImportHandle>[]): void {
        promises.forEach(prom => {
            prom.then(handle => {
                HellImporter.add_import_to_node(node, handle);
            });
        });
    }


    // ============================================================================================
    // helpers
    // ============================================================================================

    public static add_import_to_node(node: Node, handle: HellImportHandle): void {
        if (!handle.html) {
            console.warn(`failed to add resource [${handle}] - html is undefined`);
            return;
        }
        node.appendChild(handle.html.content.cloneNode(true));
    }

    public static add_all_imports_to_node(node: Node, handles: HellImportHandle[]): void {
        for (const handle of handles) {
            HellImporter.add_import_to_node(node, handle);
        }
    }


    // definition helpers
    // ------------------
    public static html_def_from_path(js_path: string): HellImportDef {
        return {
            path: new URL(js_path).pathname.replace(".js", ".html"),
            html_type: HellHtmlType.NoWrap
        };
    }

    public static css_def_from_path(js_path: string): HellImportDef {
        return {
            path: new URL(js_path).pathname.replace(".js", ".css"),
            html_type: HellHtmlType.Style
        };
    }

    // other helpers
    // -------------
    public static get_actual_html_type(def: HellImportDef): HellHtmlType {
        // @ts-ignore
        if (!def.html_type || (def.html_type === HellHtmlType.FromExtension)) {
            if (def.path.endsWith(".css")) { return HellHtmlType.Style; }
            return HellHtmlType.NoWrap;
        }

        return def.html_type
    }
}
