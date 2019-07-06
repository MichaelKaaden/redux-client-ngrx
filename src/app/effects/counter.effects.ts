import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap, withLatestFrom } from "rxjs/operators";

import * as counterActions from "../actions/counter.actions";
import * as errorActions from "../actions/error.actions";
import { Counter } from "../models/counter";
import { IAppState } from "../reducers";
import { getCounters } from "../selectors/counters.selectors";
import { CounterService } from "../services/counter.service";

@Injectable()
export class CounterEffects {
    constructor(private actions$: Actions, private store$: Store<IAppState>, private counterService: CounterService) {}

    decrementPending$ = createEffect(() =>
        this.actions$.pipe(
            ofType(counterActions.decrementPending),
            mergeMap((payload) => {
                return this.counterService.decrementCounter(payload.index, payload.by).pipe(
                    map((counter) => counterActions.decrementCompleted({ index: payload.index, counter })),
                    catchError((error: string) =>
                        of(
                            errorActions.errorOccurred({
                                error: this.setError("decrementPending$", `decrementing counter ${payload.index} failed with ${error}`),
                            }),
                        ),
                    ),
                );
            }),
        ),
    );

    incrementPending$ = createEffect(() =>
        this.actions$.pipe(
            ofType(counterActions.incrementPending),
            mergeMap((payload) => {
                return this.counterService.incrementCounter(payload.index, payload.by).pipe(
                    map((counter) => counterActions.incrementCompleted({ index: payload.index, counter })),
                    catchError((error: string) =>
                        of(
                            errorActions.errorOccurred({
                                error: this.setError("incrementPending$", `incrementing counter ${payload.index} failed with ${error}`),
                            }),
                        ),
                    ),
                );
            }),
        ),
    );

    loadPending$ = createEffect(() =>
        this.actions$.pipe(
            ofType(counterActions.loadPending),
            withLatestFrom(this.store$),
            mergeMap(([payload, state]) => {
                // hint: using switchMap instead would of course cancel any previous HTTP requests
                if (payload.index < 0) {
                    return of(errorActions.errorOccurred({ error: this.setError("loadPending$", `index ${payload.index} < 0`) }));
                }

                // re-use an already loaded counter
                const cachedCounter: Counter = getCounters(state).find((item: Counter) => item.index === payload.index);
                if (cachedCounter && !cachedCounter.isLoading) {
                    return of(
                        counterActions.loadCompleted({
                            index: payload.index,
                            counter: { index: cachedCounter.index, value: cachedCounter.value },
                        }),
                    );
                }

                return this.counterService.counter(payload.index).pipe(
                    map((value) => counterActions.loadCompleted({ index: payload.index, counter: value })),
                    catchError((error: string) =>
                        of(
                            errorActions.errorOccurred({
                                error: this.setError("loadPending$", `retrieving counter ${payload.index} failed with ${error}`),
                            }),
                        ),
                    ),
                );
            }),
        ),
    );

    loadAllPending$ = createEffect(() =>
        this.actions$.pipe(
            ofType(counterActions.loadAllPending),
            mergeMap((action) => {
                return this.counterService.counters().pipe(
                    map((counters) => counterActions.loadAllCompleted({ counters })),
                    catchError((error: string) =>
                        of(
                            errorActions.errorOccurred({
                                error: this.setError("loadAllPending$", `retrieving all counters failed with ${error}`),
                            }),
                        ),
                    ),
                );
            }),
        ),
    );

    setError(methodName: string, message: string): string {
        return `error in the "${methodName}" action creator: "${message}"`;
    }
}
