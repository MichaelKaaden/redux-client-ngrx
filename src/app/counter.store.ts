import { Injectable } from "@angular/core";
import { AdaptCommon, getAction, getHttpSources, Source, splitSources, toSource } from "@state-adapt/core";
import { catchError, concat, concatMap, filter, from, mergeMap, of, tap, withLatestFrom } from "rxjs";
import { counterAdapter, countersInitialState } from "./counter.adapter";
import { CounterService } from "./services/counter.service";

@Injectable({ providedIn: "root" })
export class CounterStore {
    itemId$ = from([0, 1, 2, 3, 4, 5]);
    countersSpy$ = this.adapt.spy("counters", counterAdapter).all$;
    counterRequest$ = this.itemId$.pipe(
        withLatestFrom(this.countersSpy$),
        filter(([id, counters]) => !counters.some(({ index }) => id === index)),
        mergeMap(([id]) =>
            concat(
                of(getAction("[Counters] request$", id)),
                this.counterService.counter(id).pipe(
                    toSource("[Counters] success$"),
                    catchError((err) => {
                        const errStr = `loadPending$ retrieving counter ${id} failed with ${err}`;
                        return of(getAction("[Counters] error$", [id, errStr] as [number, string]));
                    }),
                ),
            ),
        ),
    );
    counterRequest = splitSources(this.counterRequest$, {
        request$: "[Counters] request$",
        success$: "[Counters] success$",
        error$: "[Counters] error$",
    });

    countersRequest = getHttpSources("[Counters] [All]", this.counterService.counters(), (res) => [!!res, res, "Error"]);

    increment$ = new Source<number[]>("[Counters] increment$ request$");
    incrementRequest$ = this.increment$.pipe(
        concatMap(({ payload: [id, by] }) =>
            concat(
                of(getAction("[Counters] increment$ request$", id)),
                this.counterService.incrementCounter(id, by).pipe(
                    toSource("[Counters] increment$ success$"),
                    catchError((err) => {
                        const errStr = `loadPending$ retrieving counter ${id} failed with ${err}`;
                        return of(getAction("[Counters] error$", [id, errStr] as [number, string]));
                    }),
                ),
            ),
        ),
    );
    incrementRequest = splitSources(this.incrementRequest$, {
        success$: "[Counters] increment$ success$",
        error$: "[Counters] increment$ error$",
    });
    decrement$ = new Source<number[]>("[Counters] decrement$ request$");
    decrementRequest$ = this.decrement$.pipe(
        concatMap(({ payload: [id, by] }) =>
            concat(
                of(getAction("[Counters] decrement$ request$", id)),
                this.counterService.decrementCounter(id, by).pipe(
                    toSource("[Counters] decrement$ success$"),
                    catchError((err) => {
                        const errStr = `loadPending$ retrieving counter ${id} failed with ${err}`;
                        return of(getAction("[Counters] error$", [id, errStr] as [number, string]));
                    }),
                ),
            ),
        ),
    );
    decrementRequest = splitSources(this.decrementRequest$, {
        success$: "[Counters] decrement$ success$",
        error$: "[Counters] decrement$ error$",
    });

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

    constructor(private adapt: AdaptCommon<any>, private counterService: CounterService) {}
}
