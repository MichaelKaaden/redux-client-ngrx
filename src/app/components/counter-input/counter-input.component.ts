import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Counter } from "../../models/counter";
import { MatIcon } from "@angular/material/icon";
import { MatMiniFabButton } from "@angular/material/button";
import { ProgressComponent } from "../progress/progress.component";

@Component({
    selector: "mk-counter-input",
    templateUrl: "./counter-input.component.html",
    styleUrls: ["./counter-input.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ProgressComponent, MatMiniFabButton, MatIcon],
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
