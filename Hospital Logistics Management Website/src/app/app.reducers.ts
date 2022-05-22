import { storeLogger } from "ngrx-store-logger";

import { environment } from "../environments/environment";
import { Action, ActionReducer, ActionReducerMap, createFeatureSelector, MetaReducer, combineReducers, createSelector } from '@ngrx/store';
import * as fromCommon from "./reducers/common.reducer";
import { localStorageSync } from 'ngrx-store-localstorage';



import * as fromCurrentProject from "./reducers/mp_current_project";

export const FEATURE_NAME = '';
const STORE_KEYS_TO_PERSIST = ['common','current_project'];

export interface State {
    common: fromCommon.CommonState,
    current_project: any,
}

export const appReducers = {
    common: fromCommon.reducer,
    current_project: fromCurrentProject.reducer,
};
export function loggerReducer(reducer: ActionReducer<State>): any {
    // default, no options
    return storeLogger()(reducer);
}

// export const metaReducers = environment.production ? [] : [loggerReducer]
export function localStorageSyncReducer(reducer: ActionReducer<State>): ActionReducer<State> {
    return localStorageSync({
        keys: STORE_KEYS_TO_PERSIST,
        rehydrate: true,
    })(reducer);
}
export const metaReducers: Array<MetaReducer<State, Action>> = [localStorageSyncReducer];

export const getProjectDetailsState = createFeatureSelector<State>("project_details");

