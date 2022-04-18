export class HellStore<T> {
    protected _state: T;

    private _callbacks: Function[] = [];



    constructor(initial_state: T) {
        this._state = initial_state;
    }



    public get_state(): T {
        return { ...this._state };
    }

    public subscribe(callback: Function): void {
        this._callbacks.push(callback);
    }

    protected change_state(new_state: T): void {
        console.info("state changed:", new_state);

        this._state = new_state;
        this._callbacks.forEach(val => val());
    }
}
