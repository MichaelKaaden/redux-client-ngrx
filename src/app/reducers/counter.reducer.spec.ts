import {
    DecrementCompleted,
    DecrementPending,
    IncrementCompleted,
    IncrementPending,
    LoadAllCompleted,
    LoadAllPending,
    LoadCompleted,
    LoadPending,
} from "../actions/counter.actions";
import { Counter } from "../models/counter";
import { CountersState, initialState, reducer } from "./counter.reducer";

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
    const getItemForIndex = (theState: CountersState, theIndex: number): Counter => {
        return theState.counters.find((theCounter: Counter) => theCounter.index === theIndex);
    };

    describe("unknown action", () => {
        it("should return the initial state", () => {
            const action = {} as any;

            const result = reducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe("load pending action", () => {
        it("should add a counter if the app state is empty", () => {
            const action = new LoadPending({ index: index });

            const result = reducer(initialState, action);

            expect(initialState.counters.length).toBe(0);
            expect(result.counters).toBeDefined();
            expect(result.counters.length).toBe(1);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).toBeDefined();
            expect(newCounter.value).toBeUndefined();
            expect(newCounter.isLoading).toBeTruthy();
            expect(newCounter.isSaving).toBeFalsy();
        });

        it("should add a counter if the counter is not yet in the app state", () => {
            state.counters = [anotherCounter, yetAnotherCounter];

            const result = reducer(state, new LoadPending({ index: index }));

            expect(state.counters.length).toBe(2);
            expect(result.counters.length).toBe(3);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).toBeDefined();
            expect(newCounter.value).toBeUndefined();
            expect(newCounter.isLoading).toBeTruthy();
            expect(newCounter.isSaving).toBeFalsy();
        });

        it("should not change the other counters if the counter is not yet in the app state", () => {
            state.counters = [
                { index: anotherCounter.index, value: anotherCounter.value },
                { index: yetAnotherCounter.index, value: yetAnotherCounter.value },
            ];

            const result = reducer(state, new LoadPending({ index: index }));

            expect(state.counters.length).toBe(2);
            expect(result.counters.length).toBe(3);

            const resultAnotherCounter = getItemForIndex(result, anotherCounter.index);
            expect(resultAnotherCounter).toEqual(anotherCounter);
            const resultYetAnotherCounter = getItemForIndex(result, yetAnotherCounter.index);
            expect(resultYetAnotherCounter).toEqual(yetAnotherCounter);
        });

        it("should sort the counter list if the counter is not yet in the app state", () => {
            state.counters = [anotherCounter, yetAnotherCounter];

            const result = reducer(state, new LoadPending({ index: index }));

            expect(state.counters.length).toBe(2);
            expect(result.counters.length).toBe(3);
            expect(result.counters[0].index).toBe(0);
            expect(result.counters[1].index).toBe(1);
            expect(result.counters[2].index).toBe(2);
        });

        it("should not add a counter if the counter already is in the app state", () => {
            counter = { index };
            counter.isLoading = true;
            state.counters = [counter];

            const result = reducer(state, new LoadPending({ index: index }));

            expect(state.counters.length).toBe(1);
            expect(result).toBe(state);
        });
    });

    describe("load completed action", () => {
        it("should set the properties for the placeholder counter as single counter in the array", () => {
            const oldCounter: Counter = { index };
            oldCounter.isLoading = true;

            state.counters = [oldCounter];

            const result = reducer(state, new LoadCompleted({ index, counter }));

            expect(result.counters.length).toBe(1);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter.index).toBe(oldCounter.index);
            expect(newCounter.value).toBe(value);
            expect(newCounter.isLoading).toBeFalsy();
        });

        it("should set the properties for the placeholder counter for some counters in the array", () => {
            const oldCounter: Counter = { index };
            oldCounter.isLoading = true;
            state.counters = [anotherCounter, oldCounter, yetAnotherCounter];

            const result = reducer(state, new LoadCompleted({ index, counter }));

            expect(result.counters.length).toBe(3);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter.index).toBe(oldCounter.index);
            expect(newCounter.value).toBe(value);
            expect(newCounter.isLoading).toBeFalsy();
        });

        it("should handle a non-present counter", () => {
            state.counters = [anotherCounter, yetAnotherCounter];

            const result = reducer(state, new LoadCompleted({ index, counter }));

            expect(result.counters.length).toBe(state.counters.length);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).toBeUndefined();
        });
    });

    describe("load all pending action", () => {
        it("should not add to the app state", () => {
            const result = reducer(state, new LoadAllPending());

            expect(state.counters.length).toBe(0);
            expect(result.counters.length).toBe(0);
        });

        it("should not change the app state", () => {
            state.counters = [anotherCounter, counter, yetAnotherCounter];

            const result = reducer(state, new LoadAllPending());

            expect(result.counters).toBe(state.counters);
        });
    });

    describe("load all completed action", () => {
        it("should add all counters to the state", () => {
            expect(state.counters.length).toBe(0);

            const result = reducer(state, new LoadAllCompleted({ counters: [anotherCounter, counter, yetAnotherCounter] }));
            expect(result.counters).not.toBe(state.counters);
            expect(state.counters.length).toBe(0);
            expect(result.counters.length).toBe(3);
            expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
            expect(getItemForIndex(result, counter.index)).toBe(counter);
            expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
        });

        it("should ignore results already present", () => {
            state.counters = [anotherCounter, counter, yetAnotherCounter];

            const doubleCounter: Counter = { index, value };

            const result = reducer(state, new LoadAllCompleted({ counters: [doubleCounter] }));

            expect(result.counters.length).toBe(state.counters.length);
            expect(getItemForIndex(result, counter.index)).toBe(counter);
            expect(getItemForIndex(result, doubleCounter.index)).toBe(counter);
        });

        it("should add counters to existing ones in the state", () => {
            state.counters = [anotherCounter, yetAnotherCounter];

            const result = reducer(state, new LoadAllCompleted({ counters: [anotherCounter, counter, yetAnotherCounter] }));

            expect(state.counters.length).toBe(2);
            expect(result.counters.length).toBe(3);
            expect(getItemForIndex(result, counter.index)).toBe(counter);
            expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
            expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
        });

        it("should sort the counters by index", () => {
            const result = reducer(state, new LoadAllCompleted({ counters: [yetAnotherCounter, counter, anotherCounter] }));

            expect(result.counters.length).toBe(3);
            expect(result.counters[0].index).toBe(anotherCounter.index);
            expect(result.counters[1].index).toBe(counter.index);
            expect(result.counters[2].index).toBe(yetAnotherCounter.index);
        });
    });

    describe("decrement pending action", () => {
        it("should set the isSaving flag", () => {
            const by = 3;

            state.counters = [anotherCounter, counter, yetAnotherCounter];

            const result = reducer(state, new DecrementPending({ index, by }));

            expect(result).not.toBe(state);
            expect(result.counters).not.toBe(state.counters);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).not.toBe(counter);
            expect(newCounter.isSaving).toBeTruthy();
            expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
            expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
        });
    });

    describe("increment pending action", () => {
        it("should set the isSaving flag", () => {
            const by = 3;

            state.counters = [anotherCounter, counter, yetAnotherCounter];

            const result = reducer(state, new IncrementPending({ index, by }));

            expect(result).not.toBe(state);
            expect(result.counters).not.toBe(state.counters);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).not.toBe(counter);
            expect(newCounter.isSaving).toBeTruthy();
            expect(getItemForIndex(result, anotherCounter.index)).toBe(anotherCounter);
            expect(getItemForIndex(result, yetAnotherCounter.index)).toBe(yetAnotherCounter);
        });
    });

    describe("decrement completed action", () => {
        it("should not decrement a counter not in the app state", () => {
            const result = reducer(state, new DecrementCompleted({ index, counter }));

            expect(result.counters.length).toBe(0);
        });

        it("should decrement a single counter in the app state", () => {
            state.counters = [counter];

            const result = reducer(state, new DecrementCompleted({ index, counter: { index, value: value - 1 } }));
            expect(result).not.toBe(state);
            expect(result.counters).not.toBe(state.counters);
            expect(result.counters.length).toBe(state.counters.length);
            const oldItem = getItemForIndex(state, index);
            const newItem = getItemForIndex(result, index);
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value - 1);
        });

        it("should decrement a counter in the middle of the app state", () => {
            state.counters = [anotherCounter, counter, yetAnotherCounter];

            const result = reducer(state, new DecrementCompleted({ index, counter: { index, value: value - 1 } }));
            expect(result).not.toBe(state);
            expect(result.counters).not.toBe(state.counters);
            expect(result.counters.length).toBe(state.counters.length);
            const oldItem = getItemForIndex(state, index);
            const newItem = getItemForIndex(result, index);
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value - 1);
        });

        it("should handle a non-present counter", () => {
            state.counters = [anotherCounter, yetAnotherCounter];

            const result = reducer(state, new DecrementCompleted({ index, counter: { index, value: value - 1 } }));
            expect(result.counters.length).toBe(state.counters.length);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).toBeUndefined();
        });
    });

    describe("increment completed action", () => {
        it("should not increment a counter not in the app state", () => {
            const result = reducer(state, new IncrementCompleted({ index, counter }));

            expect(result.counters.length).toBe(0);
        });

        it("should increment a single counter in the app state", () => {
            state.counters = [counter];

            const result = reducer(state, new IncrementCompleted({ index, counter: { index, value: value + 1 } }));
            expect(result).not.toBe(state);
            expect(result.counters).not.toBe(state.counters);
            expect(result.counters.length).toBe(state.counters.length);
            const oldItem = getItemForIndex(state, index);
            const newItem = getItemForIndex(result, index);
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value + 1);
        });

        it("should increment a counter in the middle of the app state", () => {
            state.counters = [anotherCounter, counter, yetAnotherCounter];

            const result = reducer(state, new IncrementCompleted({ index, counter: { index, value: value + 1 } }));
            expect(result).not.toBe(state);
            expect(result.counters).not.toBe(state.counters);
            expect(result.counters.length).toBe(state.counters.length);
            const oldItem = getItemForIndex(state, index);
            const newItem = getItemForIndex(result, index);
            expect(newItem).not.toBe(oldItem);
            expect(newItem.value).toBe(oldItem.value + 1);
        });

        it("should handle a non-present counter", () => {
            state.counters = [anotherCounter, yetAnotherCounter];

            const result = reducer(state, new IncrementCompleted({ index, counter: { index, value: value + 1 } }));
            expect(result.counters.length).toBe(state.counters.length);

            const newCounter = getItemForIndex(result, index);
            expect(newCounter).toBeUndefined();
        });
    });
});
