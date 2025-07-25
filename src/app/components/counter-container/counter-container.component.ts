import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { CounterActions } from "../../actions";
import { Counter } from "../../models/counter";
import { selectCounter } from "../../selectors/counters.selectors";
import { AsyncPipe } from "@angular/common";
import { CounterInputComponent } from "../counter-input/counter-input.component";
import { CounterHeadingComponent } from "../counter-heading/counter-heading.component";
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from "@angular/material/card";

@Component({
    selector: "mk-counter-container",
    templateUrl: "./counter-container.component.html",
    styleUrls: ["./counter-container.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        CounterHeadingComponent,
        MatCardContent,
        CounterInputComponent,
        AsyncPipe,
    ]
})
export class CounterContainerComponent implements OnInit {
    private store = inject(Store);

    @Input({ required: true })
    counterIndex;

    counter$: Observable<Counter>;

    ngOnInit() {
        this.counter$ = this.store.select(selectCounter(this.counterIndex));

        this.store.dispatch(CounterActions.loadPending({ index: this.counterIndex }));
    }

    // needed to capture "this" properly
    public decrement = (by: number): void => {
        this.store.dispatch(CounterActions.decrementPending({ index: this.counterIndex, by }));
    };

    // needed to capture "this" properly
    public increment = (by: number): void => {
        this.store.dispatch(CounterActions.incrementPending({ index: this.counterIndex, by }));
    };
}
