import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, mergeMap, withLatestFrom } from "rxjs/operators";

import { CounterActionTypes, LoadCompleted, LoadPending } from "../actions/counter.actions";
import { ErrorOccurred } from "../actions/error.actions";
import { ICounter } from "../models/counter";
import { getCounters, IAppState } from "../reducers";
import { CounterService } from "../services/counter.service";

@Injectable()
export class CounterEffects {
    @Effect()
    loadPending = this.actions$.pipe(
        ofType<LoadPending>(CounterActionTypes.LoadPending),
        map((action) => action.payload),
        withLatestFrom(this.store$),
        mergeMap(([payload, state]) => {
            // hint: using switchMap instead would of course cancel any previous HTTP requests
            if (payload.index < 0) {
                return of(new ErrorOccurred({ error: this.setError("loadPending", `index ${payload.index} < 0`) }));
            }

            // re-use an already loaded counter
            const cachedCounter: ICounter = getCounters(state).find((item: ICounter) => item.index === payload.index);
            if (cachedCounter && !cachedCounter.isLoading) {
                return of(new LoadCompleted({ index: payload.index, counter: cachedCounter }));
            }

            return this.counterService.counter(payload.index).pipe(
                map((value) => new LoadCompleted({ index: payload.index, counter: value })),
                catchError((error: HttpErrorResponse) =>
                    of(
                        new ErrorOccurred({
                            error: this.setError("loadPending", `retrieving the counter failed with ${error.message}`),
                        })
                    )
                )
            );
        }),
        catchError((err) => of(new ErrorOccurred({ error: this.setError("loadPending", err) })))
    );

    constructor(private actions$: Actions, private store$: Store<IAppState>, private counterService: CounterService) {}

    setError(methodName: string, message: string): string {
        return `error in the "${methodName}" action creator: "${message}"`;
    }
}
