import { expect } from "@angular/flex-layout/_private-utils/testing";
import { Counter } from "../models/counter";
import { CountersState, initialState } from "../reducers/counter.reducer";
import { initializeStateWith } from "../reducers/counter.reducer.spec";
import {
    selectAverageSum,
    selectCounter,
    selectCounters,
    selectCountersState,
    selectCounterSum,
    selectNumOfCounters,
} from "./counters.selectors";

describe("counters selectors", () => {
    const index = 0;
    const value = 42;
    let counter: Counter;
    let counterWithoutValue: Counter;
    let emptyState: CountersState;
    let theState: CountersState;
    let stateWithCounterWithoutValue: CountersState;

    beforeEach(() => {
        counter = { index, value };
        counterWithoutValue = { index: index + 2 };
        emptyState = initialState;
        theState = initializeStateWith([counter]);
        stateWithCounterWithoutValue = initializeStateWith([counterWithoutValue]);
    });

    describe("selectCountersState", () => {
        it("should select the counters state", () => {
            expect(selectCountersState.projector(emptyState)).toEqual({ ids: [], entities: {} });
            expect(selectCountersState.projector(theState)).toEqual({ ids: [counter.index], entities: { [counter.index]: counter } });
            expect(selectCountersState.projector(stateWithCounterWithoutValue)).toEqual({
                ids: [counterWithoutValue.index],
                entities: { [counterWithoutValue.index]: counterWithoutValue },
            });
        });
    });

    describe("getCounters", () => {
        it("should select counters", () => {
            expect(selectCounters.projector(emptyState).length).toBe(0);
            expect(selectCounters.projector(theState).length).toBe(1);
            expect(selectCounters.projector(theState)).toEqual([counter]);
            expect(selectCounters.projector(stateWithCounterWithoutValue)).toEqual([counterWithoutValue]);
        });
    });

    describe("getCounter", () => {
        it("should select a counter", () => {
            expect(selectCounter(index)({ counters: initializeStateWith([]) })).toBeUndefined();

            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            expect(selectCounter(index)({ counters: initializeStateWith([counter, anotherCounter]) })).toEqual(counter);
            expect(selectCounter(index)({ counters: initializeStateWith([anotherCounter, counter]) })).toEqual(counter);
            expect(selectCounter(index + 2)({ counters: initializeStateWith([counterWithoutValue]) })).toEqual(counterWithoutValue);
        });
    });

    describe("getNumOfCounters", () => {
        it("should calculate the number of counters", () => {
            expect(selectNumOfCounters.projector(emptyState)).toBe(0);
            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            expect(selectNumOfCounters.projector(initializeStateWith([anotherCounter]))).toBe(1);
            expect(selectNumOfCounters.projector(initializeStateWith([counter, anotherCounter]))).toBe(2);
            expect(selectNumOfCounters.projector(initializeStateWith([counter, anotherCounter, counterWithoutValue]))).toBe(3);
        });
    });

    describe("getCounterSum", () => {
        it("should calculate the sum of the counter values", () => {
            expect(selectCounterSum.projector([])).toBe(0);
            expect(selectCounterSum.projector([counterWithoutValue])).toBe(0);
            expect(selectCounterSum.projector([counter])).toBe(42);
            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            expect(selectCounterSum.projector([counter, anotherCounter])).toBe(42 + 43);
            expect(selectCounterSum.projector([counter, counterWithoutValue])).toBe(42);
        });
    });

    describe("getAverageSum", () => {
        it("should calculate the average counter value", () => {
            expect(selectAverageSum.projector(0, 0)).toBe(0);
            expect(selectAverageSum.projector(1, 1)).toBe(1);
            expect(selectAverageSum.projector(2, 4)).toBe(2);
            expect(selectAverageSum.projector(2, 3)).toBe(1.5);
        });
    });
});
