import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LoadAllPending } from "../../actions/counter.actions";
import * as fromRoot from "../../reducers";
import { IAppState } from "../../reducers";

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
        this.loadAll();
        this.numOfCounters$ = this.store$.pipe(select(fromRoot.getNumOfCounters));
        this.counterValueSum$ = this.store$.pipe(select(fromRoot.getCounterSum));
        this.averageCounterValue$ = this.store$.pipe(select(fromRoot.getAverageSum));
    }

    private loadAll() {
        this.store$.dispatch(new LoadAllPending());
    }
}
