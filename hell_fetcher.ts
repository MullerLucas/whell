export class HellDomain {
    private static _domain: string = "https://localhost";

    public static set_domain(domain: string): void {
        HellDomain._domain = domain;
    }

    public static url(url: string): string {
        return url;
        // return `${HellDomain._domain}/${url}`;
    }
}

export class HellFetcher {
    private static readonly INIT_BASE: RequestInit = {
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };

    private static readonly INIT_POST_HEADERS: RequestInit = {
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    };


    public static async get (url: string): Promise<Response> {
        return fetch(
            HellDomain.url(url),
            {
                ...HellFetcher.INIT_BASE,
                method: "GET",
            }
        );
    }

    public static async post(url: string, data: any = {}): Promise<Response> {
        return fetch(
            HellDomain.url(url),
            {
                ...HellFetcher.INIT_BASE,
                ...HellFetcher.INIT_POST_HEADERS,
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            }
        );
    }

    public static async put(url: string, data: any = {}): Promise<Response> {
        return fetch(
            HellDomain.url(url),
            {
                ...HellFetcher.INIT_BASE,
                ...HellFetcher.INIT_POST_HEADERS,
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            }
        );
    }

    public static async delete(url: string, data: any = {}): Promise<Response> {
        return fetch(
            HellDomain.url(url),
            {
                ...HellFetcher.INIT_BASE,
                method: "DELETE", // *GET, POST, PUT, DELETE, etc.
                body: JSON.stringify(data) // body data type must match "Content-Type" header
            }
        );
    }

    public static async to_text(promise: Promise<Response>): Promise<string> {
        return promise.then(value => value.text());
    }
}
