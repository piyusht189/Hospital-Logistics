import { ProjectActions, ProjectActionTypes } from "./../actions/project";
const initialState = '';

export function reducer(state = initialState, action: ProjectActions): any {
    switch (action.type) {
       // case ProjectActionTypes.UpsertCurrentProjectSuccess:
       //     return action["payload"]['project_id'];
       //     case ProjectActionTypes.UpsertCurrentProjectOnlySuccess:
       //         return action["payload"]['project_id'];
       // case ProjectActionTypes.UnLoad:
       //     return initialState;
        default:
            return state;
    }
}
