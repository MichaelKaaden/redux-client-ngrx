import { Component } from "@angular/core";

@Component({
    selector: "mk-counter-list",
    templateUrl: "./counter-list.component.html",
    styleUrls: ["./counter-list.component.css"],
})
export class CounterListComponent {
    counterIndices: number[];
    numOfCounters = 6;

    constructor() {
        this.counterIndices = Array(this.numOfCounters)
            .fill(0)
            .map((x, i) => i);
    }
}
