import {
    Component,
    OnInit,
    Input,
    OnDestroy,
    OnChanges,
    SimpleChanges
} from "@angular/core";

@Component({
    selector: "app-map-icon-image",
    templateUrl: "./map-icon-image.component.html",
    styleUrls: ["./map-icon-image.component.css"]
})
export class MapIconImageComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    pos_rotation = 0;
    motion = false;
    constructor() { }
    ngOnChanges(changes: SimpleChanges) {
        if ("did" in changes) {
           
        }
    }
    ngOnInit() { }
    ngOnDestroy() {
    }
    getMarkerRoatation(rotation) {
        const deg = rotation;
        return "rotate(" + deg + "deg)";
    }
}
