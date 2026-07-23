import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Counter } from "../../models/counter";
import { ProgressComponent } from "../progress/progress.component";

@Component({
    selector: "mk-counter-heading",
    templateUrl: "./counter-heading.component.html",
    styleUrls: ["./counter-heading.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ProgressComponent],
})
export class CounterHeadingComponent {
    counter = input.required<Counter>();
    counterIndex = input.required<number>();
}
