import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-root',
  template: `
  <ng-snotify></ng-snotify>
  <ngx-spinner bdOpacity="1" bdColor="rgba(51,51,51,0.7)" size="medium" color="#ffffff" type="ball-clip-rotate-multiple"
      fullScreen="true">
      <p style="color: white;margin-top:20px">Just a moment...</p>
  </ngx-spinner>
  <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Drive Craft Labs';
}
