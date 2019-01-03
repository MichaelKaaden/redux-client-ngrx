import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Counter } from "../../models/counter";

@Component({
    selector: "mk-counter-heading",
    templateUrl: "./counter-heading.component.html",
    styleUrls: ["./counter-heading.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterHeadingComponent {
    @Input()
    counter: Counter;

    @Input()
    counterIndex: number;

    constructor() {}
}
