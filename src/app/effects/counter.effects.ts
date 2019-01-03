import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap, withLatestFrom } from "rxjs/operators";

import {
    CounterActionTypes,
    DecrementCompleted,
    DecrementPending,
    IncrementCompleted,
    IncrementPending,
    LoadAllCompleted,
    LoadAllPending,
    LoadCompleted,
    LoadPending,
} from "../actions/counter.actions";
import { ErrorOccurred } from "../actions/error.actions";
import { Counter } from "../models/counter";
import { IAppState } from "../reducers";
import { getCounters } from "../selectors/counters.selectors";
import { CounterService } from "../services/counter.service";

@Injectable()
export class CounterEffects {
    constructor(private actions$: Actions, private store$: Store<IAppState>, private counterService: CounterService) {}

    @Effect()
    decrementPending$ = this.actions$.pipe(
        ofType<DecrementPending>(CounterActionTypes.DecrementPending),
        map((action) => action.payload),
        mergeMap((payload) => {
            return this.counterService.decrementCounter(payload.index, payload.by).pipe(
                map((counter) => new DecrementCompleted({ index: payload.index, counter })),
                catchError((error: string) =>
                    of(
                        new ErrorOccurred({
                            error: this.setError("decrementPending$", `decrementing counter ${payload.index} failed with ${error}`),
                        }),
                    ),
                ),
            );
        }),
    );

    @Effect()
    incrementPending$ = this.actions$.pipe(
        ofType<IncrementPending>(CounterActionTypes.IncrementPending),
        map((action) => action.payload),
        mergeMap((payload) => {
            return this.counterService.incrementCounter(payload.index, payload.by).pipe(
                map((counter) => new IncrementCompleted({ index: payload.index, counter })),
                catchError((error: string) =>
                    of(
                        new ErrorOccurred({
                            error: this.setError("incrementPending$", `incrementing counter ${payload.index} failed with ${error}`),
                        }),
                    ),
                ),
            );
        }),
    );

    @Effect()
    loadPending$ = this.actions$.pipe(
        ofType<LoadPending>(CounterActionTypes.LoadPending),
        map((action) => action.payload),
        withLatestFrom(this.store$),
        mergeMap(([payload, state]) => {
            // hint: using switchMap instead would of course cancel any previous HTTP requests
            if (payload.index < 0) {
                return of(new ErrorOccurred({ error: this.setError("loadPending$", `index ${payload.index} < 0`) }));
            }

            // re-use an already loaded counter
            const cachedCounter: Counter = getCounters(state).find((item: Counter) => item.index === payload.index);
            if (cachedCounter && !cachedCounter.isLoading) {
                return of(new LoadCompleted({ index: payload.index, counter: { index: cachedCounter.index, value: cachedCounter.value } }));
            }

            return this.counterService.counter(payload.index).pipe(
                map((value) => new LoadCompleted({ index: payload.index, counter: value })),
                catchError((error: string) =>
                    of(
                        new ErrorOccurred({
                            error: this.setError("loadPending$", `retrieving counter ${payload.index} failed with ${error}`),
                        }),
                    ),
                ),
            );
        }),
    );

    @Effect()
    loadAllPending$ = this.actions$.pipe(
        ofType<LoadAllPending>(CounterActionTypes.LoadAllPending),
        mergeMap((action) => {
            return this.counterService.counters().pipe(
                map((counters) => new LoadAllCompleted({ counters })),
                catchError((error: string) =>
                    of(
                        new ErrorOccurred({
                            error: this.setError("loadAllPending$", `retrieving all counters failed with ${error}`),
                        }),
                    ),
                ),
            );
        }),
    );

    setError(methodName: string, message: string): string {
        return `error in the "${methodName}" action creator: "${message}"`;
    }
}
