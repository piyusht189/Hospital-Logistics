import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AuthenticationService } from "./authentication.service";

@Injectable()
export class RouteGuardService implements CanActivate {
    constructor(
        public router: Router,
        public authService: AuthenticationService
    ) { }

    /**
     * add all checks to authorize access to given route
     */
    public canActivate(): boolean {
        if (!this.authService.isAuthorizedUser()) {
            this.router.navigate(["/"]);
            return false;
        }
        return true;
    }
}
