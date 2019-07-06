import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as counterActions from "../../actions/counter.actions";
import { IAppState } from "../../reducers";
import { getAverageSum, getCounterSum, getNumOfCounters } from "../../selectors/counters.selectors";

@Component({
    selector: "mk-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
    counterValueSum$: Observable<number>; // the sum of all counters
    numOfCounters$: Observable<number>; // the number of counters
    averageCounterValue$: Observable<number>;

    constructor(private store$: Store<IAppState>) {}

    ngOnInit() {
        this.numOfCounters$ = this.store$.pipe(select(getNumOfCounters));
        this.counterValueSum$ = this.store$.pipe(select(getCounterSum));
        this.averageCounterValue$ = this.store$.pipe(select(getAverageSum));

        this.loadAll();
    }

    private loadAll() {
        this.store$.dispatch(counterActions.loadAllPending());
    }
}
