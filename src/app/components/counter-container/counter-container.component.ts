import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input } from "@angular/core";
import { Store } from "@ngrx/store";
import { CounterActions } from "../../actions";
import { selectCounter } from "../../selectors/counters.selectors";
import { CounterInputComponent } from "../counter-input/counter-input.component";
import { CounterHeadingComponent } from "../counter-heading/counter-heading.component";
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from "@angular/material/card";

@Component({
    selector: "mk-counter-container",
    templateUrl: "./counter-container.component.html",
    styleUrls: ["./counter-container.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, CounterHeadingComponent, MatCardContent, CounterInputComponent],
})
export class CounterContainerComponent implements OnInit {
    private store = inject(Store);

    counterIndex = input.required<number>();

    counter = computed(() => this.store.selectSignal(selectCounter(this.counterIndex()))());

    ngOnInit() {
        this.store.dispatch(CounterActions.loadPending({ index: this.counterIndex() }));
    }

    public decrement(by: number): void {
        this.store.dispatch(CounterActions.decrementPending({ index: this.counterIndex(), by }));
    }

    public increment(by: number): void {
        this.store.dispatch(CounterActions.incrementPending({ index: this.counterIndex(), by }));
    }
}
