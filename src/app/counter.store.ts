import { Injectable } from "@angular/core";
import { AdaptCommon, getHttpActions, getHttpSources, Source, splitHttpSources } from "@state-adapt/core";
import { concatMap, filter, from, mergeMap, withLatestFrom } from "rxjs";
import { counterAdapter, countersInitialState } from "./counter.adapter";
import { CounterService } from "./services/counter.service";

@Injectable({ providedIn: "root" })
export class CounterStore {
    itemId$ = from([0, 1, 2, 3, 4, 5]);
    countersSpy$ = this.adapt.spy("counters", counterAdapter).all$;
    counterRequest$ = this.itemId$.pipe(
        withLatestFrom(this.countersSpy$),
        filter(([id, counters]) => !counters.some(({ index }) => id === index)),
        mergeMap(([id]) => getHttpActions(this.counterService.counter(id), (res) => [!!res, res, "Error"], id)),
    );
    counterRequest = splitHttpSources("[Counters]", this.counterRequest$);

    countersRequest = getHttpSources("[Counters] [All]", this.counterService.counters(), (res) => [!!res, res, "Error"]);

    increment$ = new Source<number[]>("[Counters] increment$ request$");
    incrementRequest$ = this.increment$.pipe(
        concatMap(({ payload: [id, by] }) =>
            getHttpActions(
                this.counterService.incrementCounter(id, by),
                (res) => [!!res, res, `loadPending$ retrieving counter ${id} failed`],
                id,
            ),
        ),
    );
    incrementRequest = splitHttpSources("[Counters] increment$", this.incrementRequest$);

    decrement$ = new Source<number[]>("[Counters] decrement$ request$");
    decrementRequest$ = this.decrement$.pipe(
        concatMap(({ payload: [id, by] }) =>
            getHttpActions(
                this.counterService.incrementCounter(id, by),
                (res) => [!!res, res, `loadPending$ retrieving counter ${id} failed`],
                id,
            ),
        ),
    );
    decrementRequest = splitHttpSources("[Counters] decrement$", this.decrementRequest$);

    errorsReset$ = new Source<void>("[Counters] resetErrors$");

    store = this.adapt.init(["counters", counterAdapter, countersInitialState], {
        awaitCounter: this.counterRequest.request$,
        receiveCounter: this.counterRequest.success$,
        setCounterError: [this.counterRequest.error$, this.incrementRequest.error$, this.decrementRequest.error$],
        receiveAll: this.countersRequest.success$,
        setError: this.countersRequest.error$,
        awaitUpdate: [this.increment$, this.decrement$],
        receiveUpdate: [this.incrementRequest.success$, this.decrementRequest.success$],
        resetErrors: this.errorsReset$,
        noop: [this.countersRequest.request$],
    });

    errors$ = this.store.errors$;
    numOfCounters$ = this.store.numOfCounters$;
    counterSum$ = this.store.counterSum$;
    average$ = this.store.average$;
    all$ = this.store.all$;

    constructor(private adapt: AdaptCommon, private counterService: CounterService) {}
}
