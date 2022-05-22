import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ROUTES } from "./app.routes";
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { appReducers, metaReducers } from "./app.reducers";
import { EFFECTS } from "./app.effects";
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouteGuardService } from './services/route-guard.service';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { GISOAuthInterceptor } from './services/gis-oauth.interceptor';
import { ToastDefaults, SnotifyService, SnotifyModule } from 'ng-snotify';
import { notifyService } from './services/snotify';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { ProjectService } from './services/project_service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StorageServiceModule } from "angular-webstorage-service";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MatTooltipModule} from '@angular/material/tooltip';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd, DaterangepickerComponent } from 'ngx-daterangepicker-material';
import { LoginComponent } from './static/login/login.component';
import { MomentModule } from 'ngx-moment';
import { HeaderComponent } from './dynamic/containers/header/header.component';
import { NavigationComponent } from './dynamic/containers/navigation/navigation.component';
import { NguiMapModule} from '@ngui/map';
import { AgmCoreModule } from "@agm/core";
import { AmbulanceDashboardComponent } from './dynamic/components/ambulance-dashboard/ambulance-dashboard.component';
import { MapIconImageComponent } from './dynamic/components/ambulance-dashboard/map-icon-image/map-icon-image.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {MatTabsModule} from '@angular/material/tabs';
import { UiSwitchModule } from 'ngx-toggle-switch';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {DpDatePickerModule} from 'ng2-date-picker';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ReportsComponent } from './dynamic/components/reports/reports.component';
import { GisHttpService } from './services/gis-http.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    NavigationComponent,
    AmbulanceDashboardComponent,
    MapIconImageComponent,
    ReportsComponent,
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    SnotifyModule,
    HttpClientModule,
    StorageServiceModule,
    BrowserAnimationsModule,
    CommonModule,
    NgxPaginationModule,
    MatTooltipModule,
    PasswordStrengthMeterModule,
    TooltipModule,
    MatTabsModule,
    MomentModule,
    UiSwitchModule,
    NgxMaterialTimepickerModule,
    DpDatePickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?sensor=false&libraries=drawing,geometry,places&key=AIzaSyDSajiOQJxvgkAWjhA6ZOjUHi83ju_ACwE'}),
    NgxSmartModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDSajiOQJxvgkAWjhA6ZOjUHi83ju_ACwE",
      libraries: ["places", "drawing", "geometry"]
  }),
    EffectsModule.forRoot(EFFECTS),
    StoreModule.forRoot(appReducers, { metaReducers }),
    RouterModule.forRoot(ROUTES, {
      useHash: false,
      preloadingStrategy: PreloadAllModules
     }),
    StoreDevtoolsModule.instrument({
      name: "Drive Craft NgRx Store DevTools",
      maxAge: 100,
      logOnly: environment.production
  }),
    NgxDaterangepickerMd.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents:[DaterangepickerComponent],
  providers: [
    RouteGuardService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GISOAuthInterceptor,
            multi: true
        },
        { provide: "SnotifyToastConfig", useValue: ToastDefaults },
        SnotifyService,
        notifyService,
        AuthenticationService,
        UserService,
        ProjectService,
        GisHttpService,
        GISOAuthInterceptor,
        AsyncPipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
