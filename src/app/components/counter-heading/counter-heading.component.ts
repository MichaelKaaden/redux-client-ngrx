import { Component, Input } from "@angular/core";
import { ICounter } from "../../models/counter";

@Component({
    selector: "mk-counter-heading",
    templateUrl: "./counter-heading.component.html",
    styleUrls: ["./counter-heading.component.css"],
})
export class CounterHeadingComponent {
    @Input()
    counter: ICounter;

    @Input()
    counterIndex: number;

    constructor() {}
}
