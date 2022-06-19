import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { map, Observable } from "rxjs";
import { CounterStore } from "src/app/counter.store";
import { Counter } from "../../models/counter";

@Component({
    selector: "mk-counter-container",
    templateUrl: "./counter-container.component.html",
    styleUrls: ["./counter-container.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterContainerComponent implements OnInit {
    @Input() counterIndex: number;

    counter$: Observable<Counter>;

    constructor(private store: CounterStore) {}

    ngOnInit() {
        this.counter$ = this.store.all$.pipe(map((counters) => counters.find(({ index }) => index === this.counterIndex)));
    }

    // needed to capture "this" properly
    public decrement = (by: number): void => {
        this.store.decrement$.next([this.counterIndex, by]);
    };

    // needed to capture "this" properly
    public increment = (by: number): void => {
        this.store.increment$.next([this.counterIndex, by]);
    };
}
