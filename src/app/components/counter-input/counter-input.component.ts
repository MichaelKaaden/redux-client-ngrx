import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Counter } from "../../models/counter";
import { MatIcon } from "@angular/material/icon";
import { MatMiniFabButton } from "@angular/material/button";
import { ProgressComponent } from "../progress/progress.component";

@Component({
    selector: "mk-counter-input",
    templateUrl: "./counter-input.component.html",
    styleUrls: ["./counter-input.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ProgressComponent, MatMiniFabButton, MatIcon],
})
export class CounterInputComponent {
    @Input({ required: true })
    counter!: Counter;

    @Input({ required: true })
    counterIndex!: number;

    @Output()
    decrement = new EventEmitter<number>();

    @Output()
    increment = new EventEmitter<number>();

    constructor() {}

    public onDecrementClick(): void {
        this.decrement.emit(1);
    }

    public onIncrementClick(): void {
        this.increment.emit(1);
    }
}
