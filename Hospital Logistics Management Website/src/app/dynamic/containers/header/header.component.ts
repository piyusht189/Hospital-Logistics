import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as RootReducer from "../../../app.reducers"
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { notifyService } from 'src/app/services/snotify';
import * as CommonActions from "../../../actions/common.action";
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input()
  current

  name
  role

  edit_id
  edit_name
  edit_phone
  edit_email
  email
  hosp_id
  edit_password
  user_obj_holder = {};
  notis = []
  uid
  constructor(public router: Router,public ngxSmartModalService: NgxSmartModalService ,public notify: notifyService, public spinner: NgxSpinnerService, public http: HttpClient, public rootstore: Store<RootReducer.State>) { 
    this.rootstore
    .select(state => state.common.user)
    .subscribe(userObj => {
        if(userObj){
            this.user_obj_holder = JSON.parse(JSON.stringify(userObj));
            this.name = userObj['uname'];
            this.role = userObj['u_role'];
            this.edit_name = userObj['uname'];
            this.hosp_id = userObj['hid'];
            this.edit_email = userObj['uemail'];
            this.email = userObj['uemail'];
            this.edit_password = '';
            this.edit_phone = userObj['uphone'];
            this.edit_id = userObj['uid']
        }
    });
  }

  ngOnInit(): void {
    this.get_notifications();
  }
  get_notifications(){
    if(+this.hosp_id){
    this.spinner.show();
    let req_body = { hid: this.hosp_id }
    this.http.post('https://drivecraftlab.com/backend_gis/api/notifications/get_notifications.php', req_body).pipe(map(data => {
      this.spinner.hide();
      if (data['status_code'] === 200) {
        this.notis = data['notifications']
      }else{
        //this.notify.onError("Error", 'Network Not Connected!');
      }

    })).subscribe(result => {
    });
  }
  }
  getformatted(val){
    return val ? moment.utc(val,'YYYY-MM-DD HH:mm:ss').tz('Asia/Kuwait').format('hh:mm A DD/MM/YYYY') : 'NA';
  }
  logout(){
    this.spinner.show();
    this.http.post('https://drivecraftlab.com/backend_gis/api/user/user_logout.php?uid=' + this.edit_id, {}).pipe(map(data => {
      this.spinner.hide();
      if (data['status_code'] === 200) {
         this.rootstore.dispatch(new CommonActions.Unload({}));
         this.router.navigate(['login']);
         window.location.reload();
      }else{
        this.notify.onError("Error", 'Network Not Connected!');
      }

    })).subscribe(result => {
    });
  }
 

}
