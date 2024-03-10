import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Counter } from "../../models/counter";
import { ProgressComponent } from "../progress/progress.component";

@Component({
    selector: "mk-counter-heading",
    templateUrl: "./counter-heading.component.html",
    styleUrls: ["./counter-heading.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ProgressComponent],
})
export class CounterHeadingComponent {
    @Input({ required: true })
    counter: Counter;

    @Input({ required: true })
    counterIndex: number;

    constructor() {}
}
