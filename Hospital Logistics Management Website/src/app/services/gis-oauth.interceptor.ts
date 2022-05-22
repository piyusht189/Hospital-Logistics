import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpParams,
  HttpClient,
  HttpResponse
} from "@angular/common/http";

import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";

import * as RootReducer from "../app.reducers";
import { tap, catchError, map } from 'rxjs/operators';
import * as CommonActions from "../actions/common.action";
import { Router } from '@angular/router';
import { notifyService } from './snotify';

@Injectable()
export class GISOAuthInterceptor implements HttpInterceptor {
  private token: string;
  email
  id
  constructor(public notify: notifyService, public router: Router,public rootstore: Store<RootReducer.State>, public store: Store<RootReducer.State>, public http: HttpClient) {
    store
      .select(state => state.common.user)
      .subscribe(userObj => {this.token = userObj['token'] ? userObj['token'] : '';
      this.id = userObj['uid'];
    this.email = userObj['uemail']});
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let requestClone;
      if(request.url == "https://drivecraftlab.com/backend_gis/api/user/user_login.php"){
          let newParams = new HttpParams({fromString: request.params.toString()});
          newParams = newParams.append('token', 'login');
          requestClone = request.clone({
            params: newParams
          });
      }else if(request.url.includes("https://drivecraftlab.com/backend_gis/api/user/user_logout.php")){
        let newParams = new HttpParams({fromString: request.params.toString()});
        newParams = newParams.append('token', 'logout');
        requestClone = request.clone({
          params: newParams
        });
    }else{
        let newParams = new HttpParams({fromString: request.params.toString()});
          newParams = newParams.append('token', this.token);
          requestClone = request.clone({
            params: newParams
          });
      }
    return next.handle(requestClone).pipe(
      tap(evt => { 
        if (evt instanceof HttpResponse) {
          if(evt.body && evt.body.status_code == 800){
              this.rootstore.dispatch(new CommonActions.Unload({}));
              if(evt.body.message){
                this.notify.onInfo("Logged Out","");
              }
              this.router.navigate(['login']);
              window.location.reload();
          }  
         }
      }),
      catchError((err: any) => {
          
          return of(err);
      }));;
  }
}
