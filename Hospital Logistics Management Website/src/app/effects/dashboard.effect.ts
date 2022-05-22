import { NgxSpinnerService } from "ngx-spinner";
import { ProjectService } from "./../services/project_service";
import * as ProjectActions from "./../actions/project";
import { ProjectActionTypes } from "./../actions/project";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import * as RootReducer from "../app.reducers";
import { take } from "rxjs/operators";
import { notifyService } from '../services/snotify';
declare var cssParse: Function;
var counter = 0;
var old_query
@Injectable()
export class DashboardEffects {
    id
    @Effect()
    public getAllProjects$: Observable<Action> = this.actions$.pipe(
        ofType(ProjectActionTypes.GetAllProjects),
        map((action: ProjectActions.GetAllProjects) => action.payload),
        switchMap(payload => {
            //this.spinner.show();
            this.id = payload.id;
            return this.projectService.getAllProjects(payload);
        }),
        map(response => {
            //this.spinner.hide()
            if (response['_failed']) {
                return new ProjectActions.GetAllProjectsFailed(response['_error']);
            } else {
                return new ProjectActions.GetAllProjectsSuccess({projects: response['_result'].projects, count:response['_result'].count} 
                );
            }
        })
    );

     
   
    constructor(
        public projectService: ProjectService,
        public actions$: Actions,
        public router: Router,
        private spinner: NgxSpinnerService,
        private notify: notifyService,
        public rootstore: Store<RootReducer.State>
    ) {
        rootstore
            .select(state => state.common.user)
            .pipe(take(1))
            .subscribe(userObj => {
                if (userObj) {
                    if (userObj["id"]) {
                        this.id = userObj["id"];
                    }
                }
            });
    }
}
