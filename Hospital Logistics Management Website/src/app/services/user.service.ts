import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { GisHttpService } from "./gis-http.service";

import { Store } from "@ngrx/store";
import * as RootReducer from "../app.reducers";
/*
import { EssenviaResponse } from '../models/essenvia-base.model'
import { UserProfile } from '../models/essenvia-user-config.model' */

@Injectable()
export class UserService {
    customer_id;
    email;
    constructor(
        public rootstore: Store<RootReducer.State>,
        public httpService: GisHttpService
    ) {
        rootstore
            .select(state => state.common.user)
            .subscribe(userObj => {
                if (userObj) {
                    if (userObj["customer_id"]) {
                        this.customer_id = userObj["customer_id"];
                    }
                    if (userObj["email"]) {
                        this.email = userObj["email"];
                    }
                }
            });
    }

    /**
     * this method will fetch user profile and auth token from server
     * @param input - login input to the service
     */
    public login(input): Observable<any> {
        return this.httpService
            .httpPost("backend_gis/api/user/user_login.php", {
                email: input.email,
                password: input.password,
                fcmtoken: input.fcmtoken
            })
            .pipe(
                map(response => {
                    // console.log("login reeponse", response);
                    if (!response._failed) {
                        response._result = this.mapLoginResponse(response.response);
                    }
                    return response;
                })
            );
    }
    public logout(): Observable<any> {
        return this.httpService
            .httpGet("auth/logout")
            .pipe(
                map(response => {
                    // console.log("device reeponse", response);
                    if (!response._failed) {
                        response._result = response.response;
                    }
                    return response;
                })
            );
    }
    

    private mapLoginResponse(r: any): { user: any; } {
        return {
            user: r.user
        };
    }

}
