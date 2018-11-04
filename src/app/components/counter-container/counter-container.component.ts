import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { LoadPending } from "../../actions/counter.actions";
import { ICounter } from "../../models/counter";
import * as fromRoot from "../../reducers";
import { IAppState } from "../../reducers";

@Component({
    selector: "mk-counter-container",
    templateUrl: "./counter-container.component.html",
    styleUrls: ["./counter-container.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
    @Input()
    counterIndex;

    counter$: Observable<ICounter>;

    constructor(private store$: Store<IAppState>) {}

    ngOnInit() {
        this.store$.dispatch(new LoadPending({ index: this.counterIndex }));
        this.counter$ = this.store$.pipe(select(fromRoot.getCounter, { index: this.counterIndex }));
    }
}
