import {IHellPage} from "./hell_router.js";

export interface IHellBaseData {
    curr_page: IHellPage;
}

export interface IHellBaseStore {
    get_state(): IHellBaseData
    act_set_curr_page(new_page: IHellPage): void;
}


