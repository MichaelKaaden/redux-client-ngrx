import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { CounterActions } from "../../actions";
import { selectAverageSum, selectCounterSum, selectNumOfCounters } from "../../selectors/counters.selectors";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { ErrorComponent } from "../error/error.component";

@Component({
    selector: "mk-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ErrorComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent],
})
export class DashboardComponent implements OnInit {
    private store = inject(Store);

    numOfCounters = this.store.selectSignal(selectNumOfCounters);
    counterValueSum = this.store.selectSignal(selectCounterSum);
    averageCounterValue = this.store.selectSignal(selectAverageSum);

    ngOnInit() {
        this.store.dispatch(CounterActions.loadAllPending());
    }
}
