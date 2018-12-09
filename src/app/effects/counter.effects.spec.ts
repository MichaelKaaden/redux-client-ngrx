import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { EffectsMetadata, getEffectsMetadata } from "@ngrx/effects";
import { provideMockActions } from "@ngrx/effects/testing";
import { StoreModule } from "@ngrx/store";
import { cold } from "jasmine-marbles";
import { Observable, of, throwError } from "rxjs";
import { DecrementCompleted, DecrementPending, IncrementCompleted, IncrementPending } from "../actions/counter.actions";
import { ErrorOccurred } from "../actions/error.actions";
import { Counter } from "../models/counter";
import { reducers } from "../reducers";
import { CounterService } from "../services/counter.service";

import { CounterEffects } from "./counter.effects";

describe("CounterEffects", () => {
    // tslint:disable-next-line:prefer-const
    let actions$: Observable<any>;
    let effects: CounterEffects;
    let metadata: EffectsMetadata<CounterEffects>;
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
        counterService = TestBed.get(CounterService);
    });

    describe("decrementPending$", () => {
        it("should register decrementPending$", () => {
            expect(metadata.decrementPending$).toEqual({ dispatch: true });
        });

        it("should create a DecrementCompleted action", () => {
            const action = new DecrementPending({ index, by });
            const completion = new DecrementCompleted({ index, counter });

            spyOn(counterService, "decrementCounter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.decrementPending$).toBeObservable(expected);
        });

        it("should create an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = new DecrementPending({ index, by });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "decrementPending$" action creator: "decrementing counter 0 failed with ${errMessage}"`;
            const error = new ErrorOccurred({ error: returnedErrMessage });

            spyOn(counterService, "decrementCounter").and.returnValue(throwError({ message: errMessage }));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.decrementPending$).toBeObservable(expected);
        });
    });

    describe("incrementPending$", () => {
        it("should register incrementPending$", () => {
            expect(metadata.incrementPending$).toEqual({ dispatch: true });
        });

        it("should create a IncrementCompleted action", () => {
            const action = new IncrementPending({ index, by });
            const completion = new IncrementCompleted({ index, counter });

            spyOn(counterService, "incrementCounter").and.returnValue(of(new Counter(index, value)));

            actions$ = cold("--a-", { a: action });
            const expected = cold("--b", { b: completion });

            expect(effects.incrementPending$).toBeObservable(expected);
        });

        it("should create an ErrorOccurred action if an error occurs during counter retrieval", () => {
            const action = new IncrementPending({ index, by });
            const errMessage = "foo";
            // tslint:disable-next-line:max-line-length
            const returnedErrMessage = `error in the "incrementPending$" action creator: "incrementing counter 0 failed with ${errMessage}"`;
            const error = new ErrorOccurred({ error: returnedErrMessage });

            spyOn(counterService, "incrementCounter").and.returnValue(throwError({ message: errMessage }));

            actions$ = cold("a|", { a: action });
            const expected = cold("b|", { b: error });

            expect(effects.incrementPending$).toBeObservable(expected);
        });
    });

    describe("loadPending$", () => {
        it("should register loadPending$", () => {
            expect(metadata.loadPending$).toEqual({ dispatch: true });
        });
    });

    describe("loadAllPending$", () => {
        it("should register loadAllPending$", () => {
            expect(metadata.loadAllPending$).toEqual({ dispatch: true });
        });
    });
});
