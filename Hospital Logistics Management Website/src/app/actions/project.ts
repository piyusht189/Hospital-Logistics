import { Action } from "@ngrx/store";

export enum ProjectActionTypes {
    UnLoad = "UNLOAD",
    GetAllProjects = "GET_ALL_PROJECTS",
    GetAllProjectsSuccess = "GET_ALL_PROJECTS_SUCCESS",
    GetAllProjectsFailed = "GET_ALL_PROJECTS_FAILED",



}

export class UnLoad implements Action {
    readonly type = ProjectActionTypes.UnLoad;
    constructor() { }
}

export class GetAllProjects implements Action {
    readonly type = ProjectActionTypes.GetAllProjects;
    constructor(public payload: any) { }
}
export class GetAllProjectsSuccess implements Action {
    readonly type = ProjectActionTypes.GetAllProjectsSuccess;
    constructor(public payload: any) { }
}
export class GetAllProjectsFailed implements Action {
    readonly type = ProjectActionTypes.GetAllProjectsFailed;
    constructor(public payload: any) { }
}





export type ProjectActions =
    | UnLoad
    | GetAllProjects
    | GetAllProjectsSuccess
    | GetAllProjectsFailed
   