import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, mergeMap, switchMap } from "rxjs/operators";

import * as CommonActions from "../actions/common.action";
import * as ProjectActions from "../actions/project";
import { NgxSpinnerService } from "ngx-spinner";
import { notifyService } from '../services/snotify';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
//import { MessagingService } from '../services/messaging.service';

@Injectable()
export class CommonEffects {
    @Effect()
    public loginRequest$: Observable<Action> = this.actions$.pipe(
        ofType(CommonActions.LOGIN_REQUEST),
        map((action: CommonActions.LoginRequest) => action.payload),
        switchMap(payload => {
            this.spinner.show();
            return this.userService.login(payload);
        }),
        map(response => {
            this.spinner.hide();
                if (response.failed) {
                    this.notify.onError("Error", response.response.message);
                    return new CommonActions.LoginFailure(response);
                } else {
                        this.notify.onInfo("Welcome", 'Now track with ease!');
                        return new CommonActions.LoginSuccess(response._result);
                }
        })
    );


    

 

    @Effect()
    public loginSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(CommonActions.LOGIN_SUCCESS),
        map((action: CommonActions.LoginSuccess) => action.payload),
        mergeMap(payload => {
            this.router.navigate(["dashboard-hospital"]);    
            return [];
        })
    );

    @Effect()
    public logoutRequest$: Observable<Action> = this.actions$.pipe(
        ofType(CommonActions.LOGOUT_REQUEST),
        map((action: CommonActions.LogoutRequest) => action.payload),
        switchMap(payload => {
            return this.userService.logout();
        }),
        map(response => {
            if (response._failed) {
                this.notify.onError("Error", "Oops something went wrong!");
                return new CommonActions.LogoutRequestFailed({});
            } else {
                this.notify.onWarning(
                    "Session Ended",
                    "User has been logged out successfully."
                );
                this.router.navigate(["/"]);
                return new ProjectActions.UnLoad();
            }
        })
    );

   

    constructor(
        public actions$: Actions,
        public router: Router,
        public authenticationService: AuthenticationService,
        public userService: UserService,
        private spinner: NgxSpinnerService,
        private notify: notifyService,
      //  private messagingService: MessagingService
    ) { }
}
