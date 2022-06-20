import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CounterStore } from "src/app/counter.store";

@Component({
    selector: "mk-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
    numOfCounters$ = this.store.numOfCounters$;
    counterValueSum$ = this.store.counterSum$;
    averageCounterValue$ = this.store.average$;

    constructor(private store: CounterStore) {}
}
