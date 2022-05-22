import { Routes } from "@angular/router";
import { RouteGuardService } from './services/route-guard.service';
import { LoginComponent } from './static/login/login.component';
import { AmbulanceDashboardComponent } from './dynamic/components/ambulance-dashboard/ambulance-dashboard.component';
import { ReportsComponent } from './dynamic/components/reports/reports.component';


export const ROUTES: Routes = [
    { path: "", component: LoginComponent },
    { path: "dashboard-hospital", component: AmbulanceDashboardComponent , canActivate: [RouteGuardService]},
    { path: "reports", component: ReportsComponent, canActivate: [RouteGuardService]},
    { path: "**", redirectTo: "" }
];
