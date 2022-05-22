import { Injectable, OnDestroy } from "@angular/core";

import { Store } from "@ngrx/store";

import * as RootReducer from "../app.reducers";
// import { UserProfile } from '../models/essenvia-user-config.model'
import { Subscription } from "rxjs";

@Injectable()
export class AuthenticationService implements OnDestroy {
    private token: string;
    /* private user: UserProfile */
    private user: any;
    private subscriptions: Subscription[] = [];

    constructor(public store: Store<RootReducer.State>) {
        this.subscriptions.push(
            store
                .select(state => state.common.user)
                .subscribe(user => (this.user = user))
        );
        this.subscriptions.push(
            store
                .select(state => state.common.token)
                .subscribe(token => (this.token = token))
        );
    }

    /**
     * implement authentication logic here
     */
    public isAuthorizedUser() {
        return (
            this.user !== {} && Object.keys(this.user).length !== 0
        );
        // return true;
    }

    public ngOnDestroy(): void {
        while (this.subscriptions.length > 0) {
            this.subscriptions.pop().unsubscribe();
        }
    }
}
