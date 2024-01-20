import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Counter } from "../../models/counter";

@Component({
    selector: "mk-counter-input",
    templateUrl: "./counter-input.component.html",
    styleUrls: ["./counter-input.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterInputComponent {
    @Input({ required: true })
    counter: Counter;

    @Input({ required: true })
    counterIndex: number;

    @Input({ required: true })
    decrementFunc: (by: number) => void;

    @Input({ required: true })
    incrementFunc: (by: number) => void;

    constructor() {}

    public decrement(): void {
        this.decrementFunc(1);
    }

    public increment(): void {
        this.incrementFunc(1);
    }
}
