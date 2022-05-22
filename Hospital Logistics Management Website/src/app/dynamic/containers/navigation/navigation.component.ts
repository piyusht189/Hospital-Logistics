import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as RootReducer from "../../../app.reducers"


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  @Input()
  current
  constructor(public rootstore: Store<RootReducer.State>) {
    this.rootstore
    .select(state => state.common.user)
    .subscribe(userObj => {
        if(userObj){
          
        }
    });
   }

  ngOnInit(): void {
  }

}
