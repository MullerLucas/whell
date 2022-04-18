const DOMAIN = "http://localhost:3000";

export async function get_file_from_hell(url: string): Promise<string> {
    // return await fetch(`http://localhost:3000/${url}`).then(r => r.text());
    return await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "default"
    }).then(r => r.text());
}
