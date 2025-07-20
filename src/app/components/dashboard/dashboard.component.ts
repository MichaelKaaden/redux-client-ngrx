import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CounterActions } from "../../actions";
import { selectAverageSum, selectCounterSum, selectNumOfCounters } from "../../selectors/counters.selectors";
import { AsyncPipe } from "@angular/common";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { ErrorComponent } from "../error/error.component";

@Component({
    selector: "mk-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ErrorComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent, AsyncPipe]
})
export class DashboardComponent implements OnInit {
    counterValueSum$: Observable<number>; // the sum of all counters
    numOfCounters$: Observable<number>; // the number of counters
    averageCounterValue$: Observable<number>;

    constructor(private store: Store) {}

    ngOnInit() {
        this.numOfCounters$ = this.store.select(selectNumOfCounters);
        this.counterValueSum$ = this.store.select(selectCounterSum);
        this.averageCounterValue$ = this.store.select(selectAverageSum);

        this.loadAll();
    }

    private loadAll() {
        this.store.dispatch(CounterActions.loadAllPending());
    }
}
