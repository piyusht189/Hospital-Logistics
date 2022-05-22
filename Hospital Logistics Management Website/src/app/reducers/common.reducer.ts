import { createSelector } from "@ngrx/store";

import * as Actions from "../actions/common.action";

export interface CommonState {
    user: any;
    subscription: any;
    rules: any;
    token: any;
}

const initialState = {
    user: {},
    subscription: {},
    rules: {},
    token: null,
};

export function reducer(
    state: CommonState = initialState,
    action: Actions.CommonActions
): CommonState {
    switch (action.type) {
        case Actions.LOGIN_REQUEST:
            return { ...state, token: null };

        case Actions.LOGIN_SUCCESS:
            return {
                ...state,
                user: action["payload"].user,
                token: action["payload"].token,
                subscription: action["payload"]["subscription"]
            };
        case Actions.UPDATE_REQUEST:
            return {
                ...state,
                user: action["payload"]
            };
        case Actions.UPDATE_SUCCESS:
            return {
                ...state,
                user: action["payload"]
            };
       
        case Actions.LOGOUT_REQUEST_SUCCESS:
            return { ...state, user: {}, token: null, subscription: {}, rules: {} };
        case Actions.UNLOAD:
                return initialState;
        default:
            return state;
    }
}
