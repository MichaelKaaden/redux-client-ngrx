import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
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
    counter = input.required<Counter>();
    counterIndex = input.required<number>();

    decrement = output<number>();
    increment = output<number>();

    public onDecrementClick(): void {
        this.decrement.emit(1);
    }

    public onIncrementClick(): void {
        this.increment.emit(1);
    }
}
