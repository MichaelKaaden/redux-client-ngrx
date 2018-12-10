import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { EffectsMetadata, getEffectsMetadata } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { Store, StoreModule } from "@ngrx/store";
import { cold } from "jasmine-marbles";
import { Observable, of, throwError } from "rxjs";
import {
    DecrementCompleted,
    DecrementPending,
    IncrementCompleted,
    IncrementPending,
    LoadCompleted,
    LoadPending,
} from "../actions/counter.actions";
import { ErrorOccurred } from "../actions/error.actions";
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
    const counter = new Counter(index, value);

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
            expect(metadata.decrementPending$).toEqual({ dispatch: true });
        });

        it("should create a DecrementCompleted action", () => {
            const action = new DecrementPending({ index, by });
            const completion = new DecrementCompleted({ index, counter });

            const decrementCounterSpy = spyOn(counterService, "decrementCounter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.decrementPending$).toBeObservable(expected);
            expect(decrementCounterSpy).toHaveBeenCalled();
        });

        it("should create an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = new DecrementPending({ index, by });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "decrementPending$" action creator: "decrementing counter ${index} failed with ${errMessage}"`;
            const error = new ErrorOccurred({ error: returnedErrMessage });

            const decrementCounterSpy = spyOn(counterService, "decrementCounter").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.decrementPending$).toBeObservable(expected);
            expect(decrementCounterSpy).toHaveBeenCalled();
        });
    });

    describe("incrementPending$", () => {
        it("should register incrementPending$", () => {
            expect(metadata.incrementPending$).toEqual({ dispatch: true });
        });

        it("should create a IncrementCompleted action", () => {
            const action = new IncrementPending({ index, by });
            const completion = new IncrementCompleted({ index, counter });

            const incrementCounterSpy = spyOn(counterService, "incrementCounter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.incrementPending$).toBeObservable(expected);
            expect(incrementCounterSpy).toHaveBeenCalled();
        });

        it("should create an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = new IncrementPending({ index, by });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "incrementPending$" action creator: "incrementing counter ${index} failed with ${errMessage}"`;
            const error = new ErrorOccurred({ error: returnedErrMessage });

            const incrementCounterSpy = spyOn(counterService, "incrementCounter").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.incrementPending$).toBeObservable(expected);
            expect(incrementCounterSpy).toHaveBeenCalled();
        });
    });

    describe("loadPending$", () => {
        it("should register loadPending$", () => {
            expect(metadata.loadPending$).toEqual({ dispatch: true });
        });

        it("should produce a LoadCompleted action on successful retrieving an counter", () => {
            const action = new LoadPending({ index });
            const completion = new LoadCompleted({ index, counter });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).toHaveBeenCalled();
        });

        it("should produce an ErrorOccurred action if the counter index is less than zero", () => {
            const negativeIndex = -1;
            const action = new LoadPending({ index: negativeIndex });
            const returnedErrMessage = `error in the "loadPending$" action creator: "index ${negativeIndex} < 0"`;
            const error = new ErrorOccurred({ error: returnedErrMessage });

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.loadPending$).toBeObservable(expected);
        });

        it("should return a counter out of the cache", () => {
            // prepare state to already have the counter loaded
            store.dispatch(new LoadPending({ index }));
            store.dispatch(new LoadCompleted({ index, counter }));

            const action = new LoadPending({ index });
            const completion = new LoadCompleted({ index, counter });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).not.toHaveBeenCalled();
        });

        it("should not return a counter out of the cache if it isn't loaded yet", () => {
            // prepare state to already have the counter loaded
            store.dispatch(new LoadPending({ index }));

            const action = new LoadPending({ index });
            const completion = new LoadCompleted({ index, counter });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).toHaveBeenCalled();
        });

        it("should produce an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = new LoadPending({ index });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "loadPending$" action creator: "retrieving counter ${index} failed with ${errMessage}"`;
            const error = new ErrorOccurred({ error: returnedErrMessage });

            const counterSpy = spyOn(counterService, "counter").and.returnValue(throwError(errMessage));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.loadPending$).toBeObservable(expected);
            expect(counterSpy).toHaveBeenCalled();
        });
    });

    describe("loadAllPending$", () => {
        it("should register loadAllPending$", () => {
            expect(metadata.loadAllPending$).toEqual({ dispatch: true });
        });
    });
});
