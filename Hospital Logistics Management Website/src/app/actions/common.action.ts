import { Action } from "@ngrx/store";

/* import { CompanyInfo } from '../models/company.model'
import { EssenviaError } from '../models/essenvia-base.model'
import { UserProfile } from '../models/essenvia-user-config.model' */

export interface FailureAction extends Action {
    payload: any;
}

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const UPDATE_REQUEST = "UPDATE_REQUEST";
export const UPDATE_SUCCESS = "UPDATE_SUCCESS";
export const UPDATE_FAILURE = "UPDATE_FAILURE";
export const CLEAR_LOGIN_ERROR = "CLEAR_LOGIN_ERROR";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_REQUEST_FAILED = "LOGOUT_REQUEST_FAILED";
export const LOGOUT_REQUEST_SUCCESS = "LOGOUT_REQUEST_SUCCESS";
export const UNLOAD = "UNLOAD";


export class LoginRequest implements Action {
    public readonly type = LOGIN_REQUEST;
    constructor(public payload: { email: string; password: string; fcmtoken: string }) { }
}

export class LoginSuccess implements Action {
    public readonly type = LOGIN_SUCCESS;
    constructor(public payload: { user: any; token: string }) { }
}

export class LoginFailure implements Action {
    public readonly type = LOGIN_FAILURE;
    constructor(public payload: any) { }
}

export class UpdateRequest implements Action {
    public readonly type = UPDATE_REQUEST;
    constructor(public payload: any) { }
}

export class UpdateSuccess implements Action {
    public readonly type = UPDATE_SUCCESS;
    constructor(public payload: any) { }
}

export class UpdateFailure implements Action {
    public readonly type = UPDATE_FAILURE;
    constructor(public payload: any) { }
}

export class ClearLoginError implements Action {
    public readonly type = CLEAR_LOGIN_ERROR;
}

export class LogoutRequest implements Action {
    public readonly type = LOGOUT_REQUEST;
    constructor(public payload: any) { }
}

export class LogoutRequestFailed implements Action {
    public readonly type = LOGOUT_REQUEST_FAILED;
    constructor(public payload: any) { }
}
export class LogoutRequestSuccess implements Action {
    public readonly type = LOGOUT_REQUEST_SUCCESS;
    constructor(public payload: any) { }
}
export class Unload implements Action {
    public readonly type = UNLOAD;
    constructor(public payload: any) { }
}
export type CommonActions =
    | LoginRequest
    | LoginSuccess
    | LoginFailure
    | UpdateRequest
    | UpdateSuccess
    | UpdateFailure
    | ClearLoginError
    | LogoutRequest
    | LogoutRequestFailed
    | LogoutRequestSuccess
    | Unload
