import { Dictionary } from "@ngrx/entity";
import * as counterActions from "../actions/counter.actions";
import { Counter } from "../models/counter";
import { adapter, CountersState, initialState, reducer, selectEntities, selectIds, selectTotal } from "./counter.reducer";

describe("Counter Reducer", () => {
    let state: CountersState;
    const index = 1;
    const value = 42;
    let counter: Counter;
    let anotherCounter: Counter;
    let yetAnotherCounter: Counter;

    beforeEach(() => {
        state = Object.assign({}, initialState); // create a copy of the state object

        // prepare some counters
        anotherCounter = { index: index - 1, value: value - 1 };
        counter = { index, value };
        yetAnotherCounter = { index: index + 1, value: value + 1 };
    });

    /*
     * Helper function to get a specific counter out of an app state object
     */
    describe("unknown action", () => {
        it("should return the initial state", () => {
            const action = {} as any;

            const result = reducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe("load pending action", () => {
        it("should add a counter if the app state is empty", () => {
            const action = counterActions.loadPending({ index: index });

            const result = reducer(initialState, action);

            expect(selectTotal(initialState)).toBe(0);
            expect(selectTotal(result)).toBe(1);

            const newCounter = result.entities[index];
            expect(newCounter).toBeDefined();
            expect(newCounter.value).toBeUndefined();
            expect(newCounter.isLoading).toBeTruthy();
            expect(newCounter.isSaving).toBeFalsy();
        });

        it("should add a counter if the counter is not yet in the app state", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadPending({ index: index }));

            expect(selectTotal(state)).toBe(2);
            expect(selectTotal(result)).toBe(3);

            const newCounter = result.entities[index];
            expect(newCounter).toBeDefined();
            expect(newCounter.value).toBeUndefined();
            expect(newCounter.isLoading).toBeTruthy();
            expect(newCounter.isSaving).toBeFalsy();
        });

        it("should not change the other counters if the counter is not yet in the app state", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadPending({ index: index }));

            expect(selectTotal(state)).toBe(2);
            expect(selectTotal(result)).toBe(3);

            const resultAnotherCounter = result.entities[anotherCounter.index];
            expect(resultAnotherCounter).toEqual(anotherCounter);
            const resultYetAnotherCounter = result.entities[yetAnotherCounter.index];
            expect(resultYetAnotherCounter).toEqual(yetAnotherCounter);
        });

        it("should sort the counter list if the counter is not yet in the app state", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadPending({ index: index }));

            expect(selectTotal(state)).toBe(2);
            expect(selectTotal(result)).toBe(3);
            expect(selectEntities(result)[0].index).toBe(0);
            expect(selectEntities(result)[1].index).toBe(1);
            expect(selectEntities(result)[2].index).toBe(2);
        });

        it("should not add a counter if the counter already is in the app state", () => {
            counter = { index };
            counter.isLoading = true;
            state = initializeStateWith([counter]);

            const result = reducer(state, counterActions.loadPending({ index: index }));

            expect(selectTotal(state)).toBe(1);
            expect(result).toBe(state);
        });
    });

    describe("load completed action", () => {
        it("should set the properties for the placeholder counter as single counter in the array", () => {
            const oldCounter: Counter = { index };
            oldCounter.isLoading = true;

            state = initializeStateWith([oldCounter]);

            const result = reducer(state, counterActions.loadCompleted({ index, counter }));

            expect(selectTotal(result)).toBe(1);

            const newCounter = result.entities[index];
            expect(newCounter.index).toBe(oldCounter.index);
            expect(newCounter.value).toBe(value);
            expect(newCounter.isLoading).toBeFalsy();
        });

        it("should set the properties for the placeholder counter for some counters in the array", () => {
            const oldCounter: Counter = { index };
            oldCounter.isLoading = true;

            state = initializeStateWith([anotherCounter, oldCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadCompleted({ index, counter }));

            expect(selectTotal(result)).toBe(3);

            const newCounter = result.entities[index];
            expect(newCounter.index).toBe(oldCounter.index);
            expect(newCounter.value).toBe(value);
            expect(newCounter.isLoading).toBeFalsy();
        });

        it("should handle a non-present counter", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadCompleted({ index, counter }));
            expect(selectTotal(result)).toBe(selectTotal(state));

            const newCounter = result.entities[index];
            expect(newCounter).toBeUndefined();
        });
    });

    describe("load all pending action", () => {
        it("should not add to the app state", () => {
            const result = reducer(state, counterActions.loadAllPending());

            expect(selectTotal(state)).toBe(0);
            expect(selectTotal(result)).toBe(0);
        });

        it("should not change the app state", () => {
            state = initializeStateWith([anotherCounter, counter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadAllPending());

            expect(result.entities).toBe(state.entities);
        });
    });

    describe("load all completed action", () => {
        it("should add all counters to the state", () => {
            expect(selectTotal(state)).toBe(0);

            const result = reducer(state, counterActions.loadAllCompleted({ counters: [anotherCounter, counter, yetAnotherCounter] }));
            expect(result.entities).not.toBe(state.entities);
            expect(selectTotal(state)).toBe(0);
            expect(selectTotal(result)).toBe(3);
            expect(result.entities[anotherCounter.index]).toBe(anotherCounter);
            expect(result.entities[counter.index]).toBe(counter);
            expect(result.entities[yetAnotherCounter.index]).toBe(yetAnotherCounter);
        });

        it("should ignore results already present", () => {
            state = initializeStateWith([anotherCounter, counter, yetAnotherCounter]);

            const doubleCounter: Counter = { index, value };

            const result = reducer(state, counterActions.loadAllCompleted({ counters: [doubleCounter] }));

            expect(selectTotal(result)).toBe(selectTotal(state));
            expect(result.entities[counter.index]).toEqual(counter);
            expect(result.entities[doubleCounter.index]).toEqual(counter);
        });

        it("should add counters to existing ones in the state", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.loadAllCompleted({ counters: [anotherCounter, counter, yetAnotherCounter] }));

            expect(selectTotal(state)).toBe(2);
            expect(selectTotal(result)).toBe(3);
            expect(result.entities[counter.index]).toBe(counter);
            expect(result.entities[anotherCounter.index]).toBe(anotherCounter);
            expect(result.entities[yetAnotherCounter.index]).toBe(yetAnotherCounter);
        });

        it("should sort the counters by index", () => {
            const result = reducer(state, counterActions.loadAllCompleted({ counters: [yetAnotherCounter, counter, anotherCounter] }));

            expect(selectTotal(result)).toBe(3);
            expect(selectIds(result)[0]).toBe(anotherCounter.index);
            expect(selectIds(result)[1]).toBe(counter.index);
            expect(selectIds(result)[2]).toBe(yetAnotherCounter.index);
        });
    });

    describe("decrement pending action", () => {
        it("should set the isSaving flag", () => {
            const by = 3;

            state = initializeStateWith([anotherCounter, counter, yetAnotherCounter]);

            const result = reducer(state, counterActions.decrementPending({ index, by }));

            expect(result).not.toBe(state);
            expect(result.entities).not.toBe(state.entities);

            const newCounter = result.entities[index];
            expect(newCounter).not.toBe(counter);
            expect(newCounter.isSaving).toBeTruthy();
            expect(result.entities[anotherCounter.index]).toBe(anotherCounter);
            expect(result.entities[yetAnotherCounter.index]).toBe(yetAnotherCounter);
        });
    });

    describe("increment pending action", () => {
        it("should set the isSaving flag", () => {
            const by = 3;

            state = initializeStateWith([anotherCounter, counter, yetAnotherCounter]);

            const result = reducer(state, counterActions.incrementPending({ index, by }));

            expect(result).not.toBe(state);
            expect(result.entities).not.toBe(state.entities);

            const newCounter = result.entities[index];
            expect(newCounter).not.toBe(counter);
            expect(newCounter.isSaving).toBeTruthy();
            expect(result.entities[anotherCounter.index]).toBe(anotherCounter);
            expect(result.entities[yetAnotherCounter.index]).toBe(yetAnotherCounter);
        });
    });

    describe("decrement completed action", () => {
        it("should not decrement a counter not in the app state", () => {
            const result = reducer(state, counterActions.decrementCompleted({ index, counter }));

            expect(selectTotal(result)).toBe(0);
        });

        it("should decrement a single counter in the app state", () => {
            state = initializeStateWith([counter]);

            const result = reducer(state, counterActions.decrementCompleted({ index, counter: { index, value: value - 1 } }));
            expect(result).not.toBe(state);
            expect(result.entities).not.toBe(state.entities);
            expect(selectTotal(result)).toBe(selectTotal(state));
            const oldItem = state.entities[index];
            const newItem = result.entities[index];
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value - 1);
        });

        it("should decrement a counter in the middle of the app state", () => {
            state = initializeStateWith([anotherCounter, counter, yetAnotherCounter]);

            const result = reducer(state, counterActions.decrementCompleted({ index, counter: { index, value: value - 1 } }));
            expect(result).not.toBe(state);
            expect(result.entities).not.toBe(state.entities);
            expect(selectTotal(result)).toBe(selectTotal(state));
            const oldItem = state.entities[index];
            const newItem = result.entities[index];
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value - 1);
        });

        it("should handle a non-present counter", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.decrementCompleted({ index, counter: { index, value: value - 1 } }));
            expect(selectTotal(result)).toBe(selectTotal(state));

            const newCounter = result.entities[index];
            expect(newCounter).toBeUndefined();
        });
    });

    describe("increment completed action", () => {
        it("should not increment a counter not in the app state", () => {
            const result = reducer(state, counterActions.incrementCompleted({ index, counter }));

            expect(selectTotal(result)).toBe(0);
        });

        it("should increment a single counter in the app state", () => {
            state = initializeStateWith([counter]);

            const result = reducer(state, counterActions.incrementCompleted({ index, counter: { index, value: value + 1 } }));
            expect(result).not.toBe(state);
            expect(result.entities).not.toBe(state.entities);
            expect(selectTotal(result)).toBe(selectTotal(state));
            const oldItem = state.entities[index];
            const newItem = result.entities[index];
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value + 1);
        });

        it("should increment a counter in the middle of the app state", () => {
            state = initializeStateWith([anotherCounter, counter, yetAnotherCounter]);

            const result = reducer(state, counterActions.incrementCompleted({ index, counter: { index, value: value + 1 } }));
            expect(result).not.toBe(state);
            expect(result.entities).not.toBe(state.entities);
            expect(selectTotal(result)).toBe(selectTotal(state));
            const oldItem = state.entities[index];
            const newItem = result.entities[index];
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value + 1);
        });

        it("should handle a non-present counter", () => {
            state = initializeStateWith([anotherCounter, yetAnotherCounter]);

            const result = reducer(state, counterActions.incrementCompleted({ index, counter: { index, value: value + 1 } }));
            expect(selectTotal(result)).toBe(selectTotal(state));

            const newCounter = result.entities[index];
            expect(newCounter).toBeUndefined();
        });
    });
});

export function initializeStateWith(counters: Counter[]): CountersState {
    const state: CountersState = adapter.getInitialState();
    const ids: number[] = [];
    const entities: Dictionary<Counter> = {};

    for (const counter of counters) {
        ids.push(counter.index);
        entities[counter.index] = counter;
    }

    state.ids = ids;
    state.entities = entities;

    return state;
}
