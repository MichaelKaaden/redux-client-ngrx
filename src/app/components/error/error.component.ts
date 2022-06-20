import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CounterStore } from "src/app/counter.store";

@Component({
    selector: "mk-error",
    templateUrl: "./error.component.html",
    styleUrls: ["./error.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
    errorsReset$ = this.store.errorsReset$;
    errors$ = this.store.errors$;

    constructor(private store: CounterStore) {}
}
