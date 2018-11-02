import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: "mk-counter-container",
    templateUrl: "./counter-container.component.html",
    styleUrls: ["./counter-container.component.css"],
})
export class CounterContainerComponent implements OnInit {
    @Input()
    counterIndex;

    constructor() {}

    ngOnInit() {}
}
