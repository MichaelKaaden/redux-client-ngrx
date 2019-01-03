import { Counter } from "../models/counter";
import { CountersState, initialState } from "../reducers/counter.reducer";
import { initializeStateWith } from "../reducers/counter.reducer.spec";
import { getAverageSum, getCounter, getCounters, getCounterSum, getNumOfCounters, selectCountersState } from "./counters.selectors";

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
            expect(getCounters.projector(emptyState).length).toBe(0);
            expect(getCounters.projector(theState).length).toBe(1);
            expect(getCounters.projector(theState)).toEqual([counter]);
            expect(getCounters.projector(stateWithCounterWithoutValue)).toEqual([counterWithoutValue]);
        });
    });

    describe("getCounter", () => {
        it("should select a counter", () => {
            expect(getCounter.projector([], { index })).toBeUndefined();

            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            expect(getCounter.projector([counter, anotherCounter], { index })).toEqual(counter);
            expect(getCounter.projector([anotherCounter, counter], { index })).toEqual(counter);
            expect(getCounter.projector([counterWithoutValue], { index: index + 2 })).toEqual(counterWithoutValue);
        });
    });

    describe("getNumOfCounters", () => {
        it("should calculate the number of counters", () => {
            expect(getNumOfCounters.projector(emptyState)).toBe(0);
            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            expect(getNumOfCounters.projector(initializeStateWith([anotherCounter]))).toBe(1);
            expect(getNumOfCounters.projector(initializeStateWith([counter, anotherCounter]))).toBe(2);
            expect(getNumOfCounters.projector(initializeStateWith([counter, anotherCounter, counterWithoutValue]))).toBe(3);
        });
    });

    describe("getCounterSum", () => {
        it("should calculate the sum of the counter values", () => {
            expect(getCounterSum.projector([])).toBe(0);
            expect(getCounterSum.projector([counterWithoutValue])).toBe(0);
            expect(getCounterSum.projector([counter])).toBe(42);
            const anotherCounter: Counter = { index: index + 1, value: value + 1 };
            expect(getCounterSum.projector([counter, anotherCounter])).toBe(42 + 43);
            expect(getCounterSum.projector([counter, counterWithoutValue])).toBe(42);
        });
    });

    describe("getAverageSum", () => {
        it("should calculate the average counter value", () => {
            expect(getAverageSum.projector(0, 0)).toBe(0);
            expect(getAverageSum.projector(1, 1)).toBe(1);
            expect(getAverageSum.projector(2, 4)).toBe(2);
            expect(getAverageSum.projector(2, 3)).toBe(1.5);
        });
    });
});
