import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, last } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { notifyService } from 'src/app/services/snotify';
import { NgxSmartModalService } from 'ngx-smart-modal';
import * as RootReducer from "../../../app.reducers"
import { NguiMapComponent } from '@ngui/map';
import { AgmCoreModule, MapsAPILoader } from "@agm/core";
import { Store } from '@ngrx/store';
import * as moment from 'moment';
declare let google: any;
import {DomSanitizer} from '@angular/platform-browser';
import { ngxCsv } from 'ngx-csv/ngx-csv';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports = []
  hid
  from
  to
  dname_holder
  completed_drives = [];
  mapOptions_driveview = {
    gestureHandling: "greedy",
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
    mapTypeControl: false,
    zoom: 4,
    center: new google.maps.LatLng(26.5,50.3),
    tilt: 60
  };
  drivePoints = []
  map_driveview
  trip_polyline
  bounds_drive
  log_holder = []
  @ViewChild(NguiMapComponent, { static: true }) nguiMapComponent: NguiMapComponent;
  constructor(private sanitizer:DomSanitizer, public ngxSmartModalService: NgxSmartModalService, public http: HttpClient, public spinner: NgxSpinnerService,public notify: notifyService,public rootstore: Store<RootReducer.State>) { 
    this.rootstore
    .select(state => state.common.user)
    .subscribe(userObj => {
        if(userObj){
            this.hid = userObj['hid'];
        }
    });
    this.to = moment().format('YYYY-MM-DD');
    this.from = moment().subtract(7,'d').format('YYYY-MM-DD');
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl('mailto:' + url);
 }
  ngOnInit(): void {
    this.getData();
  }
  onMapReadyDriveView(map){
    this.map_driveview = map;
  }
  downnloadcsv(){
    let reps = JSON.parse(JSON.stringify(this.reports));
    new ngxCsv(reps.map(e => {
      e['Driver Name'] = e['dname'];
      e['Driver Email'] = e['demail'];
      e['Total Distance Covered (Km)'] = e['total_distance'];
      e['Total Time Taken'] = e['total_time'];
      delete e['aadid'];
      delete e['dname'];
      delete e['demail'];
      delete e['total_distance'];
      delete e['total_time'];
      return e;
    }), 'Drivers Report');
  }
  getData(){
    this.spinner.show();
    this.http.post('https://drivecraftlab.com/backend_gis/api/reports/get_reports.php',{hid: this.hid, from: moment.utc(this.from+' 00:00:00', 'YYYY-MM-DD HH:mm:ss').tz('Asia/Kuwait').format('YYYY-MM-DD'), to: moment.utc(this.to+' 00:00:00', 'YYYY-MM-DD HH:mm:ss').tz('Asia/Kuwait').format('YYYY-MM-DD')}).pipe(map(data => {
          if (data['status_code'] === 200) {
            this.spinner.hide();
              this.reports = data['drivers'];
          }else{
            this.spinner.hide();
            this.notify.onError("Error", data['message']);
          }
        })).subscribe(result => {
        });
  }
  getCompletedDrives(did){
    this.spinner.show();
      this.http.post('https://drivecraftlab.com/backend_gis/api/task/get_completed_tasks.php', {did: did}).pipe(map(data => {
          this.spinner.hide();
          if (data['status_code'] === 200) {
            data['drives'] = data['drives'].map(e => {
              e.work_log = e.work_log ? JSON.parse(e.work_log) : {};
              return e;
            });
            this.completed_drives = data['drives'].reverse();
          }else{
            this.notify.onError("Error", data['message']);
          }
        })).subscribe(result => {
        });
  } 
  getFormatted1(time){
    return moment.utc(time, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Kuwait').format('hh:mm A');
  }
  getFormatted2(time){
    return moment.utc(time, 'YYYYMMDDHHmmss').tz('Asia/Kuwait').format('DD/MM/YYYY hh:mm A');
  }
  clearDrive(){
    this.drivePoints = [];
    if (this.trip_polyline) {
      this.trip_polyline.setMap(null);
  }
  }
  viewDrive(data, flag){
    this.clearDrive();
    this.bounds_drive = new google.maps.LatLngBounds();
     Object.keys(data).forEach((key,i) => {
      this.bounds_drive.extend(
        new google.maps.LatLng(data[key]['lat'], data[key]['lng'])
      );
        if(i == 0){

          if(data[key]['vehicle']){

            this.drivePoints.push({
              position: [ data[key]['lat'], data[key]['lng'] ],
              message: data[key]['message'],
              phone: data[key]['phone']
            });

          }else{
          
            this.drivePoints.push({
              position: [ data[key]['lat'], data[key]['lng'] ],
              message: data[key]['message'],
              phone: data[key]['phone'],
              icon: 'dotstart.png'
            });

          }
          var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4
          };
          this.trip_polyline = new google.maps.Polyline({
            strokeColor: "#008E7C",
            strokeOpacity: 0,
            icons: [{
              icon: lineSymbol,
              offset: '0',
              repeat: '15px'
            }],
        });
        var path = this.trip_polyline.getPath();
        path.push(new google.maps.LatLng(data[key]['lat'],data[key]['lng']));


        }else if(Object.keys(data).length-1 == i){


          if(data[key]['vehicle']){

            this.drivePoints.push({
              position: [ data[key]['lat'], data[key]['lng'] ],
              message: data[key]['message'],
              phone: data[key]['phone']
            });

          }else{
              this.drivePoints.push({
                position: [ data[key]['lat'], data[key]['lng'] ],
                message: data[key]['message'],
                phone: data[key]['phone'],
                icon: 'dotend.png'
              });
          }
          var path = this.trip_polyline.getPath();
          path.push(new google.maps.LatLng(data[key]['lat'],data[key]['lng']));


        }else{
          if(data[key]['vehicle']){

            this.drivePoints.push({
              position: [ data[key]['lat'], data[key]['lng'] ],
              message: data[key]['message'],
              phone: data[key]['phone']
            });

          }else{
            this.drivePoints.push({
              position: [ data[key]['lat'], data[key]['lng'] ],
              message: data[key]['message'],
              phone: data[key]['phone'],
              icon: 'dotmid.png'
            });
          }
          var path = this.trip_polyline.getPath();
          path.push(new google.maps.LatLng(data[key]['lat'],data[key]['lng']));

        }      
     })

      this.trip_polyline.setMap(this.map_driveview);
      this.map_driveview.fitBounds(this.bounds_drive);
  }
 
}
