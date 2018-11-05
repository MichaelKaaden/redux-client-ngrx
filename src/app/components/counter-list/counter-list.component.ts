import { Component, OnInit } from "@angular/core";

@Component({
    selector: "mk-counter-list",
    templateUrl: "./counter-list.component.html",
    styleUrls: ["./counter-list.component.css"],
})
export class CounterListComponent implements OnInit {
    counterIndices: number[];
    numOfCounters = 6;

    constructor() {
        this.counterIndices = Array(this.numOfCounters)
            .fill(0)
            .map((x, i) => i);
    }

    ngOnInit() {}
}
