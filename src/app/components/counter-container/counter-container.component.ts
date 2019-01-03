import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { DecrementPending, IncrementPending, LoadPending } from "../../actions/counter.actions";
import { Counter } from "../../models/counter";
import { IAppState } from "../../reducers";
import { getCounter } from "../../selectors/counters.selectors";

@Component({
    selector: "mk-counter-container",
    templateUrl: "./counter-container.component.html",
    styleUrls: ["./counter-container.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
    @Input()
    counterIndex;

    counter$: Observable<Counter>;

    constructor(private store$: Store<IAppState>) {}

    ngOnInit() {
        this.counter$ = this.store$.pipe(select(getCounter, { index: this.counterIndex }));

        this.store$.dispatch(new LoadPending({ index: this.counterIndex }));
    }

    // needed to capture "this" properly
    public decrement = (by: number): void => {
        this.store$.dispatch(new DecrementPending({ index: this.counterIndex, by }));
    }

    // needed to capture "this" properly
    public increment = (by: number): void => {
        this.store$.dispatch(new IncrementPending({ index: this.counterIndex, by }));
    }
}
