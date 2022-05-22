import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { notifyService } from 'src/app/services/snotify';
import * as CommonActions from "../../actions/common.action";
import { Store } from '@ngrx/store';
import * as RootReducer from "../../app.reducers";
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email
  password
  token
  constructor(public ref: ChangeDetectorRef, private angularFireMessaging: AngularFireMessaging, public notify: notifyService,public rootstore: Store<RootReducer.State>) { 
  }

  ngOnInit(): void {
    this.requestPermission();
  }
  requestPermission() {
    this.angularFireMessaging.requestPermission
    .pipe(mergeMapTo(this.angularFireMessaging.tokenChanges))
    .subscribe(
      (token) => { console.log('Permission granted! Save to the server!', token); this.token = token;this.ref.markForCheck() ; 
     
      
     },
      (error) => { console.error(error); },  
    );
    this.angularFireMessaging.messages
    .subscribe((message) => { this.notify.onSuccessLong(message['notification'].title,message['notification'].body) });
  }
  login(){
    if(this.email && this.password){
      this.rootstore.dispatch(
        new CommonActions.LoginRequest({
            email: this.email,
            password: this.password,
            fcmtoken: this.token
        })
    );
    }else{
      this.notify.onError("Error", "Please fill email and password!");
    }
  }
}
