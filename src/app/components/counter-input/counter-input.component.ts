import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ICounter } from "../../models/counter";

@Component({
    selector: "mk-counter-input",
    templateUrl: "./counter-input.component.html",
    styleUrls: ["./counter-input.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterInputComponent {
    @Input()
    counter: ICounter;

    @Input()
    counterIndex: number;

    @Input()
    decrementFunc: (by: number) => void;

    @Input()
    incrementFunc: (by: number) => void;

    constructor() {}

    public decrement(): void {
        this.decrementFunc(1);
    }

    public increment(): void {
        this.incrementFunc(1);
    }
}
