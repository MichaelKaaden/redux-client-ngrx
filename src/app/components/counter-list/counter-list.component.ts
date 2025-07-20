import { Component } from "@angular/core";
import { CounterContainerComponent } from "../counter-container/counter-container.component";

import { ErrorComponent } from "../error/error.component";

@Component({
    selector: "mk-counter-list",
    templateUrl: "./counter-list.component.html",
    styleUrls: ["./counter-list.component.css"],
    imports: [ErrorComponent, CounterContainerComponent]
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
