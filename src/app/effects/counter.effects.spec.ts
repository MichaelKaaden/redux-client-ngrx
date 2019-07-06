import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { EffectsMetadata, getEffectsMetadata } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { Store, StoreModule } from "@ngrx/store";
import { cold } from "jasmine-marbles";
import { Observable, of, throwError } from "rxjs";
import * as counterActions from "../actions/counter.actions";
import * as errorActions from "../actions/error.actions";
import { Counter } from "../models/counter";
import { IAppState, reducers } from "../reducers";
import { CounterService } from "../services/counter.service";

import { CounterEffects } from "./counter.effects";

describe("CounterEffects", () => {
    // tslint:disable-next-line:prefer-const
    let actions$: Observable<any>;
    let effects: CounterEffects;
    let metadata: EffectsMetadata<CounterEffects>;
    let store: Store<IAppState>;
    let counterService: CounterService;
    const index = 0;
    const value = 42;
    const by = 3;
    const counter: Counter = { index, value };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot(reducers)],
            providers: [
                CounterEffects,
                provideMockActions(() => actions$),
                CounterService,
                // dependencies of CounterService, needed for instantiation
                // never used because of the spies, therefore may be an empty object
                {
                    provide: HttpClient,
                    useValue: {},
                },
            ],
        });

        effects = TestBed.get(CounterEffects);
        metadata = getEffectsMetadata(effects);
        store = TestBed.get(Store);
        counterService = TestBed.get(CounterService);
    });

    describe("decrementPending$", () => {
        it("should register decrementPending$", () => {
            expect(metadata.decrementPending$).toEqual(jasmine.objectContaining({ dispatch: true }));
        });

        it("should create a DecrementCompleted action", () => {
            const action = counterActions.decrementPending({ index, by });
            const completion = counterActions.decrementCompleted({ index, counter });

            const decrementCounterSpy = spyOn(counterService, "decrementCounter").and.returnValue(of({ index, value }));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.decrementPending$).toBeObservable(expected);
            expect(decrementCounterSpy).toHaveBeenCalled();
        });

        it("should create an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = counterActions.decrementPending({ index, by });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "decrementPending$" action creator: "decrementing counter ${index} failed with ${errMessage}"`;
            const error = errorActions.errorOccurred({ error: returnedErrMessage });

            const decrementCounterSpy = spyOn(counterService, "decrementCounter").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.decrementPending$).toBeObservable(expected);
            expect(decrementCounterSpy).toHaveBeenCalled();
        });
    });

    describe("incrementPending$", () => {
        it("should register incrementPending$", () => {
            expect(metadata.incrementPending$).toEqual(jasmine.objectContaining({ dispatch: true }));
        });

        it("should create a IncrementCompleted action", () => {
            const action = counterActions.incrementPending({ index, by });
            const completion = counterActions.incrementCompleted({ index, counter });

            const incrementCounterSpy = spyOn(counterService, "incrementCounter").and.returnValue(of({ index, value }));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.incrementPending$).toBeObservable(expected);
            expect(incrementCounterSpy).toHaveBeenCalled();
        });

        it("should create an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = counterActions.incrementPending({ index, by });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "incrementPending$" action creator: "incrementing counter ${index} failed with ${errMessage}"`;
            const error = errorActions.errorOccurred({ error: returnedErrMessage });

            const incrementCounterSpy = spyOn(counterService, "incrementCounter").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.incrementPending$).toBeObservable(expected);
            expect(incrementCounterSpy).toHaveBeenCalled();
        });
    });

    describe("loadPending$", () => {
        it("should register loadPending$", () => {
            expect(metadata.loadPending$).toEqual(jasmine.objectContaining({ dispatch: true }));
        });

        it("should produce a LoadCompleted action on successful retrieving an counter", () => {
            const action = counterActions.loadPending({ index });
            const completion = counterActions.loadCompleted({ index, counter });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(of({ index, value }));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).toHaveBeenCalled();
        });

        it("should produce an ErrorOccurred action if the counter index is less than zero", () => {
            const negativeIndex = -1;
            const action = counterActions.loadPending({ index: negativeIndex });
            const returnedErrMessage = `error in the "loadPending$" action creator: "index ${negativeIndex} < 0"`;
            const error = errorActions.errorOccurred({ error: returnedErrMessage });

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.loadPending$).toBeObservable(expected);
        });

        it("should return a counter out of the cache", () => {
            // prepare state to already have the counter loaded
            store.dispatch(counterActions.loadPending({ index }));
            store.dispatch(counterActions.loadCompleted({ index, counter }));

            const action = counterActions.loadPending({ index });
            const completion = counterActions.loadCompleted({ index, counter });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(of({ index, value }));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).not.toHaveBeenCalled();
        });

        it("should not return a counter out of the cache if it isn't loaded yet", () => {
            // prepare state to already have the counter loaded
            store.dispatch(counterActions.loadPending({ index }));

            const action = counterActions.loadPending({ index });
            const completion = counterActions.loadCompleted({ index, counter });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(of({ index, value }));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).toHaveBeenCalled();
        });

        it("should produce an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = counterActions.loadPending({ index });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "loadPending$" action creator: "retrieving counter ${index} failed with ${errMessage}"`;
            const error = errorActions.errorOccurred({ error: returnedErrMessage });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).toHaveBeenCalled();
        });
    });

    describe("loadAllPending$", () => {
        it("should register loadAllPending$", () => {
            expect(metadata.loadAllPending$).toEqual(jasmine.objectContaining({ dispatch: true }));
        });

        it("should produce a LoadCompleted action on successful retrieving all counters", () => {
            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            const theCounters = [counter, anotherCounter];

            const action = counterActions.loadAllPending();
            const completion = counterActions.loadAllCompleted({ counters: theCounters });

            const countersSpy = spyOn(counterService, "counters").and.returnValue(
                of([{ index, value }, { index: index + 1, value: value + 1 }]),
            );

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadAllPending$).toBeObservable(expected);
            expect(countersSpy).toHaveBeenCalled();
        });

        it("should produce an ErrorOccurred action if an error occurs during retrieval of all counters", () => {
            const action = counterActions.loadAllPending();
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "loadAllPending$" action creator: "retrieving all counters failed with ${errMessage}"`;
            const error = errorActions.errorOccurred({ error: returnedErrMessage });

            const countersSpy = spyOn(counterService, "counters").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.loadAllPending$).toBeObservable(expected);
            expect(countersSpy).toHaveBeenCalled();
        });
    });
});
